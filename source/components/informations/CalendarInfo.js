/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text } from '../../components/common';
import { COLORS, rh, rw } from '../../configs';

const CalendarInfo = ({}) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.allTipsContainer}>
          <View style={styles.tipContainer}>
            <Text color={COLORS.textDark} small marginRight={rw(2)}>
              تخمک گذاری
            </Text>
            <MaterialCommunityIcons name="circle" color={COLORS.darkYellow} />
          </View>

          <View style={{ ...styles.tipContainer }}>
            <Text color={COLORS.textDark} small marginRight={rw(2)}>
              پی ام اس
            </Text>
            <MaterialCommunityIcons name="circle" color={COLORS.darkRed} />
          </View>

          <View style={styles.tipContainer}>
            <Text color={COLORS.textDark} small marginRight={rw(2)}>
              دوره پریودی
            </Text>
            <MaterialCommunityIcons name="circle" color={COLORS.primary} />
          </View>
        </View>

        <View style={styles.allTipsContainer}>
          <View style={{ ...styles.tipContainer }}>
            <Text color={COLORS.textDark} small marginRight={rw(2)}>
              دوره ims
            </Text>
            <MaterialCommunityIcons name="circle" color="blue" />
          </View>
          <View style={{ ...styles.tipContainer }}>
            <Text color={COLORS.textDark} small marginRight={rw(2)}>
              رابطه زناشویی
            </Text>
            <MaterialCommunityIcons name="circle" color={COLORS.red} />
          </View>

          <View style={styles.tipContainer}>
            <Text color={COLORS.textDark} small marginRight={rw(2)}>
              پیش بینی پریود
            </Text>
            <MaterialCommunityIcons name="circle" color={COLORS.orange} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: rw(28),
    marginHorizontal: rw(1),
  },
  allTipsContainer: {
    flexDirection: 'row',
    width: rw(100),
    justifyContent: 'center',
    marginTop: rh(2),
  },
});

export default CalendarInfo;
