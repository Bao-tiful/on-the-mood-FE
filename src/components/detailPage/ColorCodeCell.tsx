import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon, { IconName } from '@/components/Icon';
import typography from '@/styles/Typography';
import { Colors, OndoColors } from '@/styles/Colors';

const ColorCodeCell = ({ ondo }: { ondo: number }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}
  >
    <View style={{ flexDirection: 'row' }}>
      <Text
        style={[
          typography.label1,
          { color: Colors.black100, fontWeight: 'bold' },
        ]}
      >
        {'Note\nMood Code'}
      </Text>

      <TouchableOpacity
        style={{ marginHorizontal: 8 }}
        onPress={() => {
          // TODO: tooltip 추가하기
        }}
      >
        <Icon name={IconName.info} />
      </TouchableOpacity>
    </View>
    <Text
      style={[
        typography.title2,
        {
          color: Colors.black100,
          fontWeight: 'bold',
          textDecorationLine: 'underline',
        },
      ]}
    >
      {OndoColors.get(ondo)}
    </Text>
  </View>
);

export default ColorCodeCell;
