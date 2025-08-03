import React from 'react';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { toDateString } from '@/utils/dateUtils';
import { View, Text } from 'react-native';
import Icon, { IconName } from '../Icon';

const NoteInfoCell = ({
  createdAt,
  location,
  feelLikeTemp,
}: {
  createdAt: Date;
  location: string;
  feelLikeTemp: number;
}) => (
  <View style={{ flex: 1, gap: 8 }}>
    <Text style={[typography.heading1, { color: Colors.black100 }]}>
      {toDateString(createdAt)}
    </Text>
    <View style={{ height: 8 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Icon name={IconName.location} size={14} />
      <Text style={[typography.label1, { color: Colors.black70 }]}>
        {location}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Icon name={IconName.temperature} size={14} />
      <Text style={[typography.label1, { color: Colors.black70 }]}>
        체감온도 {feelLikeTemp}°
      </Text>
    </View>
  </View>
);

export default NoteInfoCell;
