import { useEffect, useState, useCallback } from 'react';
import notifee, { 
  AuthorizationStatus, 
  TriggerType, 
  RepeatFrequency,
  AndroidImportance,
  AndroidVisibility 
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 알림 권한 상태 타입
export type NotificationPermissionStatus = 'authorized' | 'denied' | 'provisional' | 'notDetermined';

// 알림 설정 타입
export interface NotificationSettings {
  enabled: boolean;
  time: string; // "HH:mm" 형식
}

// 기본 알림 설정
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  time: '21:00', // 오후 9시
};

const STORAGE_KEY = {
  NOTIFICATION_SETTINGS: '@notification_settings',
  PERMISSION_STATUS: '@notification_permission_status',
};

export const useNotifications = () => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>('notDetermined');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // 권한 상태 확인
  const checkPermissionStatus = useCallback(async (): Promise<NotificationPermissionStatus> => {
    try {
      const settings = await notifee.getNotificationSettings();
      
      switch (settings.authorizationStatus) {
        case AuthorizationStatus.AUTHORIZED:
        case AuthorizationStatus.PROVISIONAL:
          return 'authorized';
        case AuthorizationStatus.DENIED:
          return 'denied';
        case AuthorizationStatus.NOT_DETERMINED:
        default:
          return 'notDetermined';
      }
    } catch (error) {
      console.error('권한 상태 확인 실패:', error);
      return 'notDetermined';
    }
  }, []);

  // 권한 요청
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const settings = await notifee.requestPermission();
      
      const isGranted = settings.authorizationStatus === AuthorizationStatus.AUTHORIZED || 
                       settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
      
      const status: NotificationPermissionStatus = isGranted ? 'authorized' : 'denied';
      
      setPermissionStatus(status);
      await AsyncStorage.setItem(STORAGE_KEY.PERMISSION_STATUS, status);
      
      return isGranted;
    } catch (error) {
      console.error('권한 요청 실패:', error);
      setPermissionStatus('denied');
      return false;
    }
  }, []);

 
  // 모든 알림 취소
  const cancelAllNotifications = useCallback(async () => {
    try {
      await notifee.cancelAllNotifications();
      console.log('모든 알림이 취소되었습니다.');
    } catch (error) {
      console.error('알림 취소 실패:', error);
    }
  }, []);

 // 로컬 알림 예약
 const scheduleNotification = useCallback(async (settings: NotificationSettings) => {
  if (!settings.enabled) {
    return;
  }

  try {
    // 기존 알림 취소
    await cancelAllNotifications();

    // Android 채널 생성 (iOS는 무시됨)
    const channelId = await notifee.createChannel({
      id: 'mood_reminder',
      name: '기분 기록 알림',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'default',
    });

    // 시간 파싱
    const [hours, minutes] = settings.time.split(':').map(Number);
    
    // 내일부터 매일 반복하는 알림 설정
    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // 오늘 시간이 지났다면 내일로 설정
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    // 매일 반복 알림 생성
    await notifee.createTriggerNotification(
      {
        id: 'daily_mood_reminder',
        title: '📝 오늘의 기분 기록',
        body: '하루를 마무리하며 오늘의 감정을 기록해보세요',
        data: {
          type: 'daily_reminder',
          scheduledFor: scheduledDate.toISOString(),
        },
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
        },
        ios: {
          categoryId: 'MOOD_REMINDER',
          sound: 'default',
          badgeCount: 1,
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: scheduledDate.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      }
    );

    console.log(`알림이 ${settings.time}에 예약되었습니다.`);
  } catch (error) {
    console.error('알림 예약 실패:', error);
  }
}, [cancelAllNotifications]);


  // 알림 설정 업데이트
  const updateNotificationSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...notificationSettings, ...newSettings };
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY.NOTIFICATION_SETTINGS, JSON.stringify(updatedSettings));
      setNotificationSettings(updatedSettings);

      if (updatedSettings.enabled && permissionStatus === 'authorized') {
        await scheduleNotification(updatedSettings);
      } else {
        await cancelAllNotifications();
      }
    } catch (error) {
      console.error('알림 설정 업데이트 실패:', error);
    }
  }, [notificationSettings, permissionStatus, scheduleNotification, cancelAllNotifications]);

  // 알림 설정 로드
  const loadNotificationSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY.NOTIFICATION_SETTINGS);
      if (stored) {
        const settings = JSON.parse(stored) as NotificationSettings;
        setNotificationSettings(settings);
      }
    } catch (error) {
      console.error('알림 설정 로드 실패:', error);
    }
  }, []);

  // 초기 설정 로드
  useEffect(() => {
    const initializeNotifications = async () => {
      setIsLoading(true);
      
      try {
        // 권한 상태 확인
        const status = await checkPermissionStatus();
        setPermissionStatus(status);

        // 설정 로드
        await loadNotificationSettings();
      } catch (error) {
        console.error('알림 초기화 실기:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 알림 카테고리 설정 (앱 시작 시 한 번만)
  useEffect(() => {
    const setupNotificationCategories = async () => {
      try {
        await notifee.setNotificationCategories([
          {
            id: 'MOOD_REMINDER',
            actions: [
              {
                id: 'OPEN_APP',
                title: '기록하기',
                foreground: true,
              },
              {
                id: 'DISMISS',
                title: '나중에',
                foreground: false,
              },
            ],
          },
        ]);
      } catch (error) {
        console.error('알림 카테고리 설정 실패:', error);
      }
    };

    setupNotificationCategories();
  }, []);

  return {
    // 상태
    permissionStatus,
    notificationSettings,
    isLoading,
    
    // 메서드
    requestPermissions,
    updateNotificationSettings,
    scheduleNotification,
    cancelAllNotifications,
    checkPermissionStatus,
  };
};