import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';

type KeywordsProps = {
  keywordList: string[];
  onKeywordPress?: (keyword: string) => void;
};

const Keywords = ({ keywordList, onKeywordPress }: KeywordsProps) => {
  return (
    <View style={styles.keywordContainer}>
      {Array.from(keywordList).map((keyword, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.keywordCell} 
          onPress={() => onKeywordPress?.(keyword)}
          activeOpacity={0.7}
        >
          <Text style={styles.keywordLabel}>{keyword}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Keywords;

const styles = StyleSheet.create({
  keywordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    overflow: 'hidden',
  },
  keywordCell: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 100,
    backgroundColor: Colors.black18,
  },
  keywordLabel: {
    ...typography.label2,
  },
});
