import AsyncStorage from "@react-native-async-storage/async-storage";

// accessToken 저장
export const saveAccessToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("accessToken", token);
  } catch (error) {
    console.error("토큰 저장 실패", error);
  }
};

// accessToken 가져오기
export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    return token;
  } catch (error) {
    console.error("토큰 불러오기 실패", error);
    return null;
  }
};
