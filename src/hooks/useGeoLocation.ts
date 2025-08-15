import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/// 아직 위치 정보 접근 권한에 대한 응답을 받지 못했거나, 처리중인 경우에는 geoLocation 값으로 null을 반환합니다.
/// 접근을 거부한 경우, defaultLocation을 반환합니다.
/// 접근을 허용한 경우, 현재 사용자 기기의 위도, 경도를 반환합니다.
type geoLocation = {
  latitude: number;
  longitude: number;
};

// 서울시 중구의 위경도를 기본 location으로 가진다.
const DEFAULT_LOCATION: geoLocation = {
  latitude: 37.56100278,
  longitude: 126.9996417,
};

export function useGeoLocation() {

  const [geoLocation, setGeoLocation] = useState<geoLocation | null>(null);

  // 위치정보 제공에 대한 요청
  const askPermission = async (): Promise<boolean> => {
    const permission = Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);

    if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    }

    return result === RESULTS.GRANTED;
  };

  // 사용자의 위도, 경도 위치 정보 가져오기
  const getGeoLocation = async (): Promise<geoLocation> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  };

  useEffect(() => {
    const updateGeoLocation = async () => {
      try {
        // 위치 정보 권한 요청
        const permissionGranted = await askPermission();

        // 사용자가 위치 정보 접근 권한을 부여한 경우 위경도를 가져와 location에 담기
        if (permissionGranted) {
          const currentLocation = await getGeoLocation();
          setGeoLocation(currentLocation);
        } else {
          // 사용자가 위치 정보 접근 권한을 부여하지 않은 경우 기본 위경도를 location에 담기
          setGeoLocation(DEFAULT_LOCATION);
        }
      } catch (error) {
        console.error('위치 정보 업데이트 실패:', error);
        // 오류 발생 시 기본 위치 사용
        setGeoLocation(DEFAULT_LOCATION);
      }
    };

    updateGeoLocation();
  }, []); // 의존성 배열을 비워서 한 번만 실행되도록 수정

  return { geoLocation };
}
