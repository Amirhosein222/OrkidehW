/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { COLORS, rh, rw } from '../../../configs';

import { Text } from '../../common';

const PeriodDaysChart = ({ chartData }) => {
  const barData = [
    {
      value: 40,
      label: 'Jan',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 20, frontColor: '#ED6665' },
    {
      value: 50,
      label: 'Feb',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 40, frontColor: '#ED6665' },
    {
      value: 75,
      label: 'Mar',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 25, frontColor: '#ED6665' },
    {
      value: 30,
      label: 'Apr',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: 'gray' },
      frontColor: '#177AD5',
    },
    { value: 20, frontColor: '#ED6665' },
  ];

  const renderTitle = () => {
    return (
      <View style={{ marginTop: rh(5) }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: rh(1),
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text size={10} color={COLORS.textLight} marginRight={4}>
              شما
            </Text>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#177AD5',
                // marginRight: 8,
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text size={10} color={COLORS.textLight} marginRight={4}>
              همسالان
            </Text>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#ED6665',
                marginRight: 8,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        paddingBottom: 10,
        marginTop: rh(3),
        // backgroundColor: 'yellow',
        width: '100%',
      }}>
      <BarChart
        data={chartData}
        width={rw(64)}
        barWidth={8}
        spacing={22}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={1}
        yAxisThickness={1}
        yAxisTextStyle={{ color: 'gray' }}
        noOfSections={3}
        maxValue={75}
        yAxisLabelTexts={['لکه بینی', 'کم', 'متوسط', 'زیاد']}
        yAxisLabelWidth={rw(15)}
      />
      {renderTitle()}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          left: rh(-24),
          top: rh(28.5),
        }}>
        <Text size={11} color={COLORS.textLight}>
          روز
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PeriodDaysChart;
