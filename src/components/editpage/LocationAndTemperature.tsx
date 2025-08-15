import typography from '@/styles/Typography';
import { StyleSheet, Text, View } from 'react-native';
import Icon, { IconName } from '../Icon';
import { Colors } from '@/styles/Colors';

type LocationAndTemperatureProps = {
  location: string;
  temperature: number;
};

const LocationAndTemperature = ({
  location,
  temperature,
}: LocationAndTemperatureProps) => {
  return (
    <View style={styles.descriptionRow}>
      <View style={styles.descriptionItem}>
        <Icon name={IconName.location} size={14} color={Colors.black70} />
        <Text style={styles.descriptionLabel}>{location}</Text>
      </View>
      <Text style={styles.descriptionLabel}>|</Text>
      <View style={styles.descriptionItem}>
        <Icon name={IconName.temperature} size={14} color={Colors.black70} />
        <Text style={styles.descriptionLabel}>체감온도 {temperature}°</Text>
      </View>
    </View>
  );
};

export default LocationAndTemperature;

const styles = StyleSheet.create({
  descriptionRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionItem: {
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionLabel: {
    ...typography.label1,
    fontWeight: 600,
    color: Colors.black70,
  },
});
