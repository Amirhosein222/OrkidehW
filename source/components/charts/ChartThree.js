import React from 'react';
import * as shape from 'd3-shape';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Text } from '../common';
import { COLORS } from '../../configs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useIsPeriodDay } from '../../libs/hooks';

const { width } = Dimensions.get('screen');

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
    name: 'سسس',
    population: 60,
    color: COLORS.green,
  },
  {
    name: 'Toronto',
    population: 50,
    color: COLORS.orange,
  },
  {
    name: 'Beijing',
    population: 40,
    color: COLORS.red,
  },
  {
    name: 'New York',
    population: 20,
    color: COLORS.yellow,
  },
];

// const ChartThree = ({ chartData, route }) => {
//   const data = [50, 10, 40, 95, 4, 24];

//   const axesSvg = { fontSize: 10, fill: 'grey' };
//   const verticalContentInset = { top: 10, bottom: 10 };
//   const xAxisHeight = 40;

//   const Tooltip = ({ x, y }) => (
//     <G x={75 / 2}>
//       <Circle
//         cx={x(data[4])}
//         r={6}
//         stroke={'rgb(134, 65, 244)'}
//         strokeWidth={2}
//         fill={'red'}
//       />
//     </G>
//   );

//   return (
//     <View style={{ height: 200, padding: 20 }}>
//       <Text marginBottom="20" bold color={COLORS.pink}>
//         طول دوره پریود خانم های هم سن شما
//       </Text>
//       <View style={{ flex: 1, marginLeft: 10 }}>
//         <LineChart
//           style={{ flex: 1 }}
//           data={data}
//           contentInset={verticalContentInset}
//           svg={{ stroke: 'rgb(134, 65, 244)' }}>
//           <Tooltip />
//         </LineChart>
//         <XAxis
//           style={{ marginHorizontal: -10, height: xAxisHeight }}
//           data={data}
//           formatLabel={(value, index) => data[index]}
//           contentInset={{ left: 10, right: 10 }}
//           svg={axesSvg}
//         />
//       </View>
//     </View>
//   );
// };

// export default ChartThree;

// import React from 'react';
// import { SafeAreaView, View, Dimensions, StatusBar } from 'react-native';

// import { LineChart } from 'react-native-chart-kit';

// const labels = [
//   'Label 1',
//   'Label 2',
//   'Label 3',
//   'Label 4',
//   'Label 5',
//   'Label 6',
// ];

// const data = [
//   Math.random() * 100,
//   Math.random() * 100,
//   Math.random() * 100,
//   Math.random() * 100,
//   Math.random() * 100,
//   Math.random() * 100,
// ];
// import {
//   Chart,
//   Line,
//   Area,
//   HorizontalAxis,
//   VerticalAxis,
// } from 'react-native-responsive-linechart';

// const ChartThree = () => {
//   return (
//     <Chart
//       style={{ height: 200, width: 400 }}
//       data={[
//         { x: -2, y: 15 },
//         { x: -1, y: 10 },
//         { x: 0, y: 12 },
//         { x: 1, y: 7 },
//         { x: 2, y: 6 },
//         { x: 3, y: 8 },
//         { x: 4, y: 10 },
//         { x: 5, y: 8 },
//         { x: 6, y: 12 },
//         { x: 7, y: 14 },
//         { x: 8, y: 12 },
//         { x: 9, y: 13.5 },
//         { x: 10, y: 18 },
//       ]}
//       padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
//       xDomain={{ min: -2, max: 10 }}
//       yDomain={{ min: 0, max: 20 }}>
//       <VerticalAxis
//         tickCount={11}
//         theme={{ labels: { formatter: (v) => v.toFixed(2) } }}
//       />
//       <HorizontalAxis tickCount={5} />
//       <Area
//         theme={{
//           gradient: {
//             from: { color: '#ffa502' },
//             to: { color: '#ffa502', opacity: 0.4 },
//           },
//         }}
//       />
//       <Line
//         theme={{
//           stroke: { color: '#ffa502', width: 5 },
//           scatter: { default: { width: 4, height: 4, rx: 2 } },
//         }}
//       />
//     </Chart>
//     <View>
//       <View
//         style={{
//           alignItems: 'center',
//         }}>
//         <Text marginBottom="20" bold color={COLORS.pink}>
//           طول دوره پریود خانم های هم سن شما
//         </Text>
//       </View>
//       <View style={{ alignItems: 'center' }}>
//         <LineChart
//           data={{
//             // labels: labels,
//             datasets: [
//               {
//                 data: data,
//                 color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
//                 strokeWidth: 2, // optional
//               },
//             ],
//           }}
//           width={Dimensions.get('window').width - 50} // from react-native
//           height={220}
//           // hidePointsAtIndex={[0, 1, 2, 3, 4]}
//           chartConfig={{
//             backgroundColor: '#e26a00',
//             backgroundGradientFrom: '#D9D9D9',
//             backgroundGradientTo: '#FFF',
//             decimalPlaces: 2, // optional, defaults to 2dp
//             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             style: {
//               borderRadius: 16,
//             },
//             propsForDots: {
//               r: '6',
//               strokeWidth: '2',
//               stroke: COLORS.darkRed,
//             },
//           }}
//           bezier
//           style={{
//             marginVertical: 5,
//             borderRadius: 15,
//           }}
//         />
//       </View>
//       <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
//         <View
//           style={{
//             width: 20,
//             height: 20,
//             backgroundColor: 'red',
//             borderWidth: 2,
//             borderColor: COLORS.darkRed,
//             borderRadius: 10,
//             marginRight: 10,
//           }}
//         />
//         <Text color={COLORS.pink} bold>
//           شما
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default ChartThree;

const ChartThree = ({ chartData, route }) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <View>
      <Text
        marginBottom="20"
        bold
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
        طول دوره پریود خانم های هم سن شما
      </Text>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <PieChart
          data={pieData}
          width={width - 135}
          height={250}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          center={[40, 10]}
          absolute
          hasLegend={false}
        />
        <View style={{ alignSelf: 'center' }}>
          <Text color={COLORS.pink} bold>
            میانگین شما - 37 روز
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text color={COLORS.red} bold>
              24 روز - 20 نفر
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.red}
              style={{ marginLeft: 5 }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text color={COLORS.green} bold>
              37 روز - 40 نفر
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.green}
              style={{ marginLeft: 5 }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text color={COLORS.orange} bold>
              30 روز - 30 نفر
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.orange}
              style={{ marginLeft: 5 }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text color={COLORS.yellow} bold>
              20 روز - 15 نفر
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.yellow}
              style={{ marginLeft: 5 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChartThree;
