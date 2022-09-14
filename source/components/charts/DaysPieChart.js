/* eslint-disable react-native/no-inline-styles */
import React from 'react';
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
const pieData = [
  {
    name: 'Toronto',
    population: 20,
    color: 'purple',
  },
  {
    name: 'Beijing',
    population: 40,
    color: COLORS.darkYellow,
  },
  {
    name: 'New York',
    population: 50,
    color: COLORS.primary,
  },
];

const DaysPieChart = ({ chartData, route }) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <PieChart
        data={pieData}
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
          <Text small color={COLORS.primary} bold marginLeft={rw(1)}>
            5 دفعه
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text small color={COLORS.textLight} bold>
              تعداد کل دفعات پریود شما :
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.primary}
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
          <Text small color={COLORS.darkYellow} bold marginLeft={rw(1)}>
            5 روز
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: rh(1),
            }}>
            <Text small color={COLORS.textLight} bold>
              تعداد روزهای تخمک گذاری شما :
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.darkYellow}
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
          <Text small color="purple" bold marginLeft={rw(1)}>
            3 روز
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text small color={COLORS.textLight} bold>
              تعداد روز های PMS (سندروم پیش از قائدگی):
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color="purple"
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
