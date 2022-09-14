/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Toggle from 'react-native-toggle-element';

import Text from './Text';
import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS } from '../../configs';

const Switch = ({ active, changeStatus }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <View style={styles.switchContainer}>
      <Text small color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}>
        فعال
      </Text>
      <Toggle
        value={active}
        onPress={(newState) => changeStatus(newState)}
        containerStyle={{ alignSelf: 'center' }}
        trackBarStyle={{
          borderColor: 'green',
        }}
        trackBar={{
          activeBackgroundColor: '#DDCECE',
          inActiveBackgroundColor: isPeriodDay
            ? COLORS.lightRed
            : COLORS.lightPink,
          width: 70,
          height: 35,
        }}
        thumbButton={{
          activeBackgroundColor: COLORS.grey,
          inActiveBackgroundColor: isPeriodDay
            ? COLORS.fireEngineRed
            : COLORS.primary,
          width: 35,
          height: 35,
        }}
      />
      <Text small>غیر فعال</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});

export default Switch;
