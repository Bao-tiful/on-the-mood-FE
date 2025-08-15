export interface NotificationForm {
  id: string;
  title: string;
  body: string;
}

// 프리셋 데이터 상수 객체
export const NotificationPresets = {
  DAILY_REMINDER: {
    id: 'daily_mood_reminder',
    title: '📝 오늘의 기분 기록',
    body: '하루를 마무리하며 오늘의 감정을 기록해보세요',
  },
  // 샘플 데이터
  MORNING_GREETING: {
    id: 'morning_greeting',
    title: '🌅 좋은 아침!',
    body: '새로운 하루가 시작되었어요. 오늘의 기분은 어떤가요?',
  },
  WEEKLY_SUMMARY: {
    id: 'weekly_summary',
    title: '📊 주간 감정 요약',
    body: '이번 주 감정 기록을 확인해보세요',
  },
} as const satisfies Record<string, NotificationForm>;

// 프리셋 타입 (키값들을 타입으로)
export type NotificationPresetKey = keyof typeof NotificationPresets;