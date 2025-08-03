import { Colors } from '@/styles/Colors';
import { View } from 'react-native';

const PageDivider = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: Colors.black18,
        marginVertical: 24,
      }}
    />
  );
};

export default PageDivider;
