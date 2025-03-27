import * as Location from "expo-location";
import { useEffect, useState } from "react";

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

  // 권한 허용 여부
  const [granted, setGranted] = useState(false);
  const [location, setLocation] = useState<geoLocation | null>(null);

  // 위치정보 제공에 대한 요청
  const askPermission = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    console.log("DEBUG");
    setGranted(granted);
  };

  // 사용자의 위도, 경도 위치 정보 가져오기
  const getGeoLocation = async () => {
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    return { latitude, longitude };
  };

  useEffect(() => {
    askPermission();

    // 사용자가 위치 정보 접근 권한을 부여한 경우 위경도를 가져와 location에 담기
    if (granted) {
      getGeoLocation().then((geoLocation) => {
        setLocation(geoLocation);
      });
    }
    // 사용자가 위치 정보 접근 권한을 부여하지 않은 경우 기본 위경도를 location에 담기
    else {
      setLocation(defaultLocation);
    }
  }, [granted]);

  return { granted, location };
}
