/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Text } from '../common';
import { COLORS, rh, rw } from '../../configs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useIsPeriodDay } from '../../libs/hooks';

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const DaysPieChart = ({ chartData, route }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <PieChart
        data={chartData}
        width="100%"
        style={{ justifyContent: 'center' }}
        height={250}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        center={[rw(40), 0]}
        absolute
        hasLegend={false}
      />

      <View
        style={{
          alignSelf: 'center',
          width: '100%',
          paddingHorizontal: rw(3),
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text size={11} color={chartData[0].color} bold marginLeft={rw(1)}>
            {chartData[0].population} دفعه
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text size={11} color={COLORS.textLight} bold>
              تعداد کل دفعات پریود شما :
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={chartData[0].color}
              style={{ marginLeft: rh(1) }}
              size={20}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text size={11} color={chartData[1].color} bold marginLeft={rw(1)}>
            {chartData[1].population} روز
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: rh(1),
            }}>
            <Text size={11} color={COLORS.textLight} bold>
              تعداد روزهای تخمک گذاری شما :
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={chartData[1].color}
              style={{ marginLeft: rh(1) }}
              size={20}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text size={10} color={chartData[2].color} bold marginLeft={rw(1)}>
            {chartData[2].population} روز
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text size={10} color={COLORS.textLight} bold>
              تعداد روز های PMS (سندروم پیش از قائدگی):
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={chartData[2].color}
              style={{ marginLeft: rh(1) }}
              size={20}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default DaysPieChart;
