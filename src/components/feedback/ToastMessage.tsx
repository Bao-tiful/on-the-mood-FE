import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { View, StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import Toast, {
  BaseToast,
  ErrorToast,
  ToastShowParams,
} from 'react-native-toast-message';

/// 사용 방법
/// Toast.show 메서드를 호출하여 토스트 메시지를 화면에 띄울 수 있습니다.
/// ```
/// Toast.show({
///   type: "info",         // 현재 디자인에서 사용하는 토스트는 info 타입으로 지정하였습니다.
///   text1: "hello world", // 토스트메시지 작성
///   visibilityTime: 2000, // ms단위
/// });
/// ```

export const toastConfig = {
  info: (params: ToastShowParams) => {
    const { height } = Dimensions.get('window'); // 화면 높이를 가져옴
    return (
      <View
        style={{
          flex: 1,
          // 아래로부터 (화면 크기의 1/2 - toast의 높이)에 배치
          bottom: height / 2 - 60,
          marginHorizontal: 40,
        }}
      >
        <Pressable
          // 토스트를 탭하면 바로 닫기
          onPress={() => {
            Toast.hide();
          }}
          style={styles.toastContainer}
        >
          <Text
            style={styles.toastLabel}
            // 토스트 메시지의 최대 길이는 2줄로 지정해두었음
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {params.text1}
          </Text>
        </Pressable>
      </View>
    );
  },
  default: (params: ToastShowParams) => {
    const { height } = Dimensions.get('window'); // 화면 높이를 가져옴
    return (
      <View
        style={{
          flex: 1,
          // 아래로부터 (화면 크기의 1/2 - toast의 높이)에 배치
          bottom: height / 2 - 60,
          marginHorizontal: 40,
        }}
      >
        <Pressable
          // 토스트를 탭하면 바로 닫기
          onPress={() => {
            Toast.hide();
          }}
          style={styles.toastContainer}
        >
          <Text
            style={styles.toastLabel}
            // 토스트 메시지의 최대 길이는 2줄로 지정해두었음
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {params.text1}
          </Text>
        </Pressable>
      </View>
    );
  },
  white: (params: ToastShowParams) => {
    const { height } = Dimensions.get('window'); // 화면 높이를 가져옴
    return (
      <View
        style={{
          flex: 1,
          // 아래로부터 (화면 크기의 1/2 - toast의 높이)에 배치
          bottom: height / 2 - 60,
          marginHorizontal: 40,
        }}
      >
        <Pressable
          // 토스트를 탭하면 바로 닫기
          onPress={() => {
            Toast.hide();
          }}
          style={styles.whiteToastContainer}
        >
          <Text
            style={styles.whiteToastLabel}
            // 토스트 메시지의 최대 길이는 2줄로 지정해두었음
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {params.text1}
          </Text>
        </Pressable>
      </View>
    );
  },
  // 아래는 Default Toast Configuration
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: ToastShowParams) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props: ToastShowParams) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    backgroundColor: Colors.black100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastLabel: {
    ...typography.body,
    color: Colors.white100,
    textAlign: 'center',
  },
  whiteToastContainer: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    backgroundColor: Colors.white100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteToastLabel: {
    ...typography.body,
    color: Colors.black100,
    textAlign: 'center',
  },
});
