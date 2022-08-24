/* eslint-disable no-sparse-arrays */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS } from '../../configs';

const VerticalBar = ({
  data,
  label,
  text = true,
  color = COLORS.lightPink,
}) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <View style={[styles.barContainer, { margin: text === false ? 3 : 10 }]}>
      <View
        style={[
          styles.vBar,
          ,
          {
            height: Number(data) * 2,
            backgroundColor: isPeriodDay ? COLORS.rossoCorsa : color,
            margin: text === false ? 0 : 10,
          },
        ]}
      />
      {text ? (
        <Text color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary} small>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  vBar: {
    height: 50,
    width: 8,
    backgroundColor: COLORS.lightPink,
    borderRadius: 5,
    margin: 10,
  },
  barContainer: {
    margin: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  points: {
    backgroundColor: COLORS.primary,
  },
  assists: {
    backgroundColor: COLORS.lightPink,
  },
});

export default VerticalBar;
