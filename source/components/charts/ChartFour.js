// import React from 'react';
// import { Grid, XAxis, YAxis, BarChart } from 'react-native-svg-charts';
// import { View } from 'react-native';

// import { Text } from '../common';
// import { COLORS } from '../../configs';

// const ChartFour = ({ chartData, route }) => {
//   const data = [30, 45, 30, 20, 10, 20, 0, 9];
//   const xLabel = [
//     'روز 1',
//     'روز 2',
//     'روز 3',
//     'روز 4',
//     'روز 5',
//     'روز 6',
//     'روز 7',
//     'روز 8',
//   ];
//   const yLabel = ['لکه بینی', 'کم', 'متوسط', 'زیاد'];

//   return (
//     <View>
//       <Text marginTop="20" bold color={COLORS.primary}>
//         مقایسه خون ریزی دوره قاعدگی شما با همسالان شما
//       </Text>
//       <View style={{ height: 300, flexDirection: 'row' }}>
//         <YAxis
//           data={data}
//           contentInset={{ top: 20, bottom: 20 }}
//           svg={{ fill: 'black', fontSize: 12 }}
//           numberOfTicks={2}
//           formatLabel={(value, index) => yLabel[index]}
//         />
//         <BarChart
//           style={{ flex: 1, marginRight: 40 }}
//           data={data}
//           svg={{ fill: 'rgb(134, 65, 244)' }}
//           spacingInner={0.5}
//           contentInset={{ top: 20, bottom: 20 }}>
//           <Grid />
//         </BarChart>
//       </View>
//       <View>
//         <XAxis
//           style={{ marginHorizontal: 30 }}
//           data={data}
//           formatLabel={(value, index) => xLabel[index]}
//           contentInset={{ left: 20, right: 20 }}
//           svg={{ fontSize: 12, fill: 'black' }}
//         />
//       </View>
//     </View>
//   );
// };

// export default ChartFour;

/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, FlatList } from 'react-native';
import { BarChart, YAxis } from 'react-native-svg-charts';

import { Text } from '../common';
import VerticalBar from './VerticalBar';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS } from '../../configs';

const ChartFour = ({ chartData, route }) => {
  const isPeriodDay = useIsPeriodDay();
  let day = 1;
  const RenderBars = function (item) {
    return (
      <View style={{ margin: 20, justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row' }}>
          <VerticalBar
            data={item.item.value}
            text={false}
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          />
          <VerticalBar
            data={item.item.value}
            text={false}
            color={COLORS.dark}
          />
        </View>
        <Text bold>{item.item.label}</Text>
      </View>
    );
  };
  return (
    <View style={{ height: 200, alignItems: 'center' }}>
      <Text
        marginTop="20"
        bold
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}>
        مقایسه خون ریزی دوره قاعدگی شما با همسالان شما
      </Text>
      <FlatList data={chartData.data} horizontal renderItem={RenderBars} />
    </View>
  );
};

export default ChartFour;
