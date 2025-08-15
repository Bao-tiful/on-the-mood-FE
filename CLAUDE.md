# OnTheMood FE - Project Guide

## 프로젝트 개요
- **플랫폼**: React Native 0.76.9 (iOS/Android 크로스 플랫폼)
- **언어**: TypeScript
- **타입**: 감정 기록 및 위치 기반 일기 앱

## 빌드 및 개발 명령어

### 개발 서버
```bash
npm start                    # Metro 개발 서버 시작
```

### 빌드 및 실행
```bash
npm run ios                  # iOS 시뮬레이터에서 실행
npm run android              # Android 에뮬레이터/디바이스에서 실행
```

### 코드 품질
```bash
npm run test                 # Jest 테스트 실행
npm run lint                 # ESLint 실행
```

## 권한 설정 가이드

### iOS 권한 (ios/onthemoodFE/Info.plist)

현재 설정된 권한:
- **위치 권한**: `NSLocationWhenInUseUsageDescription` (빈 문자열로 설정됨)

필요한 권한 설정:
```xml
<!-- 위치 권한 -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>앱에서 현재 위치를 확인하여 날씨와 위치 정보를 제공합니다.</string>

<!-- 카메라 권한 (필요시) -->
<key>NSCameraUsageDescription</key>
<string>사진을 촬영하여 일기에 첨부할 수 있습니다.</string>

<!-- 사진 라이브러리 권한 (필요시) -->
<key>NSPhotoLibraryUsageDescription</key>
<string>사진을 선택하여 일기에 첨부할 수 있습니다.</string>

<!-- 알림 권한 (필요시) -->
<key>NSUserNotificationUsageDescription</key>
<string>일기 작성 알림을 보내드립니다.</string>
```

### Android 권한 (android/app/src/main/AndroidManifest.xml)

현재 설정된 권한:
- **인터넷**: `android.permission.INTERNET`

필요한 권한 설정:
```xml
<!-- 기본 권한 -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- 위치 권한 -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- 카메라 권한 (필요시) -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- 외부 저장소 권한 (필요시) -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- 알림 권한 (필요시) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

## 주요 라이브러리 및 의존성

### 위치 및 권한 관리
- `react-native-geolocation-service`: 위치 서비스
- `react-native-permissions`: 권한 관리
- `@react-native-community/geolocation`: 위치 정보 (백업)

### UI/UX
- `@react-navigation/native`: 네비게이션
- `@react-navigation/stack`: 스택 네비게이션
- `@react-navigation/bottom-tabs`: 탭 네비게이션
- `react-native-vector-icons`: 아이콘
- `react-native-linear-gradient`: 그라데이션
- `@react-native-community/blur`: 블러 효과

### 기타 기능
- `@react-native-firebase/app`: Firebase 연동
- `react-native-toast-message`: 토스트 메시지
- `react-native-device-info`: 디바이스 정보
- `axios`: HTTP 클라이언트

## 프로젝트 구조

```
src/
├── api/
│   └── endpoints/          # API 엔드포인트
├── components/            # 재사용 가능한 컴포넌트
│   ├── auth/             # 인증 관련 컴포넌트
│   ├── calendar/         # 달력 관련 컴포넌트
│   ├── editpage/         # 편집 페이지 컴포넌트
│   └── ...
├── hooks/                # 커스텀 훅
├── models/               # 데이터 모델
├── navigation/           # 네비게이션 설정
├── screens/              # 화면 컴포넌트
├── styles/               # 스타일 및 색상
└── types/                # TypeScript 타입 정의
```

## 개발 가이드

### 위치 권한 사용
- `useGeoLocation` 훅을 사용하여 위치 정보 접근
- 권한이 거부된 경우 서울시 중구를 기본 위치로 사용
- iOS: 'whenInUse' 권한 요청
- Android: ACCESS_FINE_LOCATION 권한 요청

### 코딩 컨벤션
- TypeScript 사용 (strict 모드)
- ESLint 규칙 준수
- 컴포넌트는 PascalCase
- 파일명은 camelCase

### 빌드 고려사항
- iOS: Xcode 프로젝트 설정 확인 필요
- Android: targetSdkVersion 및 권한 확인
- Metro 번들러 캐시 클리어: `npx react-native start --reset-cache`

## Claude 작업 권한 설정

Claude가 프로젝트에서 파일 시스템 작업을 수행할 때 필요한 명령어들:

### 파일 관리 명령어
```bash
# 파일/폴더 이동
mv old_path new_path

# 파일/폴더 삭제
rm file_name
rm -rf folder_name

# 파일/폴더 복사
cp source destination
cp -r source_folder destination_folder

# 폴더 생성
mkdir folder_name
mkdir -p nested/folder/structure

# 파일 권한 변경
chmod +x script.sh
chmod 755 file_name

# 심볼릭 링크 생성
ln -s target link_name
```

### Git 관련 명령어
```bash
# Git 상태 및 변경사항
git status
git diff
git add .
git commit -m "message"
git push
git pull

# 브랜치 관리
git checkout -b new-branch
git merge branch-name
git branch -d branch-name
```

### 패키지 관리
```bash
# npm/yarn 명령어
npm install package-name
npm uninstall package-name
npm run script-name
yarn add package-name
yarn remove package-name

# React Native 관련
npx react-native link
npx react-native unlink
```

### 빌드 및 개발 도구
```bash
# 캐시 정리
npm run clean
npx react-native start --reset-cache

# iOS 관련
cd ios && pod install
xcodebuild clean

# Android 관련
cd android && ./gradlew clean
```

**주의사항**: Claude가 이러한 명령어를 실행할 때는 항상 작업 전에 확인을 요청하며, 중요한 파일 삭제나 시스템 변경 시에는 백업을 권장합니다.

