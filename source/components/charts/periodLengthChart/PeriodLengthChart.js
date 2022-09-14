import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { Text } from '../../common';
import { rh, rw } from '../../../configs';

const PeriodLengthChart = () => {
  const data = [
    { value: 15, label: 3, hideDataPoint: true },
    {
      value: 30,
      label: 5,
      hideDataPoint: false,
      labelTextStyle: { color: 'blue' },
    },
    { value: 75, label: 7, hideDataPoint: true },
    { value: 100, label: 10, hideDataPoint: true },
    { value: 250, label: 12, hideDataPoint: true },
  ];

  return (
    <View style={{ alignSelf: 'center' }}>
      <LineChart
        areaChart
        curved
        maxValue={300}
        minValue={100}
        noOfSections={3}
        stepValue={100}
        data={data}
        startFillColor="rgb(46, 217, 255)"
        startOpacity={0.8}
        endFillColor="rgb(203, 241, 250)"
        endOpacity={0.3}
        height={rh(20)}
        width={rw(65)}
        showDataPointOnPress={false}
        adjustToWidth={true}
      />
    </View>
  );
};

export default PeriodLengthChart;

const styles = StyleSheet.create({});
