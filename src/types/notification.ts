export interface NotificationForm {
  id: string;
  title: string;
  body: string;
}

// 프리셋 데이터 상수 객체
export const NotificationPresets = {
  MORNING_GREETING: {
    id: 'morning_greeting',
    title: '오늘 어떤 기분으로 시작하셨나요?',
    body: '감정의 온도로 하루를 가볍게 시작해보세요.',
  },
  AFTERNOON_GREETING: {
    id: 'afternood_greeting',
    title: '오늘의 기분, 지금이 기록할 타이밍!',
    body: '지금 이순간의 무드, 잊기 전에 기록해보세요.',
  },
  NIGHT_GREETING: {
    id: 'night_greeting',
    title: '오늘 하루 어떤 감정이 가장 컸나요?',
    body: '감정의 온도를 색으로 남겨보세요.',
  },
  LATE_NIGHT_GREETING: {
    id: 'late_night_greeting',
    title: '지금 어떤 감정이 깨어있나요?',
    body: '이 감정, 나만 아는 색으로 남겨보세요.',
  },


} as const satisfies Record<string, NotificationForm>;

// 프리셋 타입 (키값들을 타입으로)
export type NotificationPresetKey = keyof typeof NotificationPresets;