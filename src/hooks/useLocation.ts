import * as Location from "expo-location";
import { useEffect, useState } from "react";

/// 아직 위치 정보 접근 권한에 대한 응답을 받지 못했거나, 처리중인 경우에는 geoLocation 값으로 null을 반환합니다.
/// 접근을 거부한 경우, defaultLocation을 반환합니다.
/// 접근을 허용한 경우, 현재 사용자 기기의 위도, 경도를 반환합니다.
type geoLocation = {
  latitude: number;
  longitude: number;
};

export function useLocation() {
  // 서울시 중구의 위경도를 기본 location으로 가진다.
  const defaultLocation: geoLocation = {
    latitude: 37.56100278,
    longitude: 126.9996417,
  };

  const [location, setLocation] = useState<geoLocation | null>(null);

  // 위치정보 제공에 대한 요청
  const askPermission = async (): Promise<boolean> => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    return granted;
  };

  // 사용자의 위도, 경도 위치 정보 가져오기
  const getGeoLocation = async () => {
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    return { latitude, longitude };
  };

  useEffect(() => {
    const updateGeoLocation = async () => {
      // 위치 정보 권한 요청
      const permissionGranted = await askPermission();

      // 사용자가 위치 정보 접근 권한을 부여한 경우 위경도를 가져와 location에 담기
      if (permissionGranted) {
        getGeoLocation().then((geoLocation) => {
          setLocation(geoLocation);
        });
      }
      // 사용자가 위치 정보 접근 권한을 부여하지 않은 경우 기본 위경도를 location에 담기
      else {
        setLocation(defaultLocation);
      }
    };

    updateGeoLocation();
  }, []);

  return { location };
}
