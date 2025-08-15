import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

type AlertModalProps = {
  isModalVisible: boolean;
  title?: string;
  content?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPressPrimary?: () => void;
  onPressSecondary?: () => void;
  dismissHandler?: () => void;
};

const AlertModal = ({
  isModalVisible,
  title = '',
  content = '',
  primaryLabel = '',
  secondaryLabel = '',
  onPressPrimary = () => {},
  onPressSecondary = () => {},
  dismissHandler = () => {},
}: AlertModalProps) => {
  return (
    <Modal transparent={true} visible={isModalVisible}>
      <TouchableWithoutFeedback onPress={dismissHandler}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.titleLabel}>{title}</Text>
            <Text style={styles.contentLabel}>{content}</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity
                onPress={onPressSecondary}
                style={styles.secondaryActionButton}
              >
                <Text style={styles.secondaryActionButtonLabel}>
                  {secondaryLabel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPressPrimary}
                style={styles.primaryActionButton}
              >
                <Text style={[styles.priamryActionButtonLabel]}>
                  {primaryLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlertModal;

const actionButton: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
  height: 50,
};
const actionButtonLabel: ViewStyle | TextStyle = {
  ...typography.body,
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: Colors.black40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    gap: 16,
  },
  titleLabel: {
    ...typography.heading2,
    color: Colors.black100,
  },
  contentLabel: {
    ...typography.body,
    color: Colors.gray,
    textAlign: 'center',
  },

  primaryActionButton: {
    ...actionButton,
    backgroundColor: Colors.black100,
    color: Colors.white100,
  },
  secondaryActionButton: {
    ...actionButton,
    backgroundColor: Colors.lightGray,
    borderColor: '#EAEDF1',
    borderWidth: 1,
    color: Colors.gray,
  },
  priamryActionButtonLabel: {
    ...actionButtonLabel,
    color: Colors.white100,
  },
  secondaryActionButtonLabel: {
    ...actionButtonLabel,
    color: Colors.gray,
  },
});
