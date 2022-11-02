import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { Text } from '../../common';
import { COLORS, rh, rw } from '../../../configs';

const PeriodLengthChart = ({ chartData }) => {
  return (
    <View
      style={{
        alignSelf: 'center',
        paddingBottom: rh(2),
        marginTop: rh(3),
        height: rh(32),
      }}>
      <LineChart
        areaChart
        curved
        maxValue={300}
        minValue={100}
        noOfSections={3}
        stepValue={100}
        data={chartData}
        startFillColor={COLORS.primary}
        startOpacity={0.8}
        endFillColor={COLORS.white}
        endOpacity={0.3}
        height={rh(22)}
        width={rw(65)}
        showDataPointOnPress={false}
        dataPointsColor={COLORS.primary}
        adjustToWidth={true}
      />
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          left: rh(-27),
          top: rh(27),
        }}>
        <Text size={10} color={COLORS.textLight}>
          طول دوره
        </Text>
      </View>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          left: rh(-51),
          top: rh(15),
          transform: [{ rotate: '90deg' }],
        }}>
        <Text size={10} color={COLORS.textLight}>
          تعداد افراد
        </Text>
      </View>
    </View>
  );
};

export default PeriodLengthChart;

const styles = StyleSheet.create({});
