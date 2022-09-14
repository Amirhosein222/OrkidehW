/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { rh, rw } from '../../../configs';

const PeriodDaysChart = () => {
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
            <Text
              style={{
                width: 60,
                height: 16,
                color: 'lightgray',
              }}>
              شما
            </Text>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#177AD5',
                marginRight: 8,
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                width: 60,
                height: 16,
                color: 'lightgray',
              }}>
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
      }}>
      <BarChart
        data={barData}
        width={rw(65)}
        barWidth={8}
        spacing={24}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={1}
        yAxisThickness={1}
        yAxisTextStyle={{ color: 'gray' }}
        noOfSections={3}
        maxValue={75}
        yAxisLabelTexts={['لکه بینی', 'کم', 'متوسط', 'زیاد']}
      />
      {renderTitle()}
    </View>
  );
};

const styles = StyleSheet.create({});

export default PeriodDaysChart;
