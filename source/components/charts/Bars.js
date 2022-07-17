/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// import { PMSInfoScreen } from '../index';
import { Text } from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS } from '../../configs';

const Bars = ({ data }) => {
  const isPeriodDay = useIsPeriodDay();
  const [pts, setPts] = useState(50);
  const [ast, setAst] = useState(100);

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={[
            styles.bar,
            styles.points,
            {
              width: pts,
              backgroundColor: isPeriodDay ? COLORS.rossoCorsa : COLORS.pink,
            },
          ]}
        />
        <Text
          alignSelf="flex-end"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          bold>
          شما 6 روز
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={[
            styles.bar,
            styles.assists,
            {
              width: ast,
              marginTop: 5,
              backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
            },
          ]}
        />
        <Text alignSelf="flex-end" color={COLORS.dark} bold>
          همسالان 2/3
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  points: {
    backgroundColor: COLORS.pink,
  },
  assists: {
    backgroundColor: COLORS.lightPink,
  },
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 8,
    marginRight: 5,
    marginBottom: 10,
  },
});

export default Bars;
