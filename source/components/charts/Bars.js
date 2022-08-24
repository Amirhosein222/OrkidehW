/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// import { PMSInfoScreen } from '../index';
import { Text } from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw } from '../../configs';

const Bars = ({ data }) => {
  const isPeriodDay = useIsPeriodDay();
  const [pts, setPts] = useState(50);
  const [ast, setAst] = useState(100);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: rh(0.5),
          justifyContent: 'center',
        }}>
        <View style={{ flexDirection: 'row', marginRight: rw(4) }}>
          <Text small color={COLORS.textLight} marginRight={rw(1)}>
            بار
          </Text>
          <Text small color={COLORS.textDark}>
            {data.count}
          </Text>
        </View>
        <Text small color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textLight}>
          شما :
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: rh(0.5),
          justifyContent: 'center',
        }}>
        <View style={{ flexDirection: 'row', marginRight: rw(2) }}>
          <Text small color={COLORS.textLight} marginRight={rw(1)}>
            بار
          </Text>
          <Text small color={COLORS.textDark}>
            1/4
          </Text>
        </View>
        <Text small color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textLight}>
          همسالان :
        </Text>
      </View>

      <View style={{ marginTop: rh(2) }}>
        <View
          style={[
            styles.bar,
            styles.points,
            {
              width: pts,
              backgroundColor: isPeriodDay ? COLORS.rossoCorsa : COLORS.primary,
            },
          ]}
        />

        <View
          style={[
            styles.bar,
            styles.assists,
            {
              width: ast,
              marginTop: 5,
              backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.textLight,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  points: {
    backgroundColor: COLORS.primary,
  },
  assists: {
    backgroundColor: COLORS.lightPink,
  },
  bar: {
    alignSelf: 'flex-start',
    borderRadius: 5,
    height: rh(0.5),
    marginRight: 5,
    // marginBottom: 5,
  },
});

export default Bars;
