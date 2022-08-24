import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../common';
import { COLORS, rh, rw } from '../../configs';

const ChartCard = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text medium color={COLORS.textDark}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: rw(84),
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: rh(2),
    marginVertical: rh(2),
    elevation: 4,
    alignSelf: 'center',
  },
});

export default ChartCard;
