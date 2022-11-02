/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text } from '../../../../components/common';
import { COLORS, rh, rw } from '../../../../configs';

const CalendarInfo = ({}) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.allTipsContainer}>
          <View style={styles.tipContainer}>
            <Text size={8} color={COLORS.textLight} small marginRight={rw(2)}>
              دوره پریودی
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.primary}
              size={14}
            />
          </View>

          <View style={styles.tipContainer}>
            <Text size={8} color={COLORS.textLight} small marginRight={rw(2)}>
              تخمک گذاری
            </Text>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.darkYellow}
              size={14}
            />
          </View>
        </View>

        <View style={styles.allTipsContainer}>
          <View style={{ ...styles.tipContainer }}>
            <Text size={8} color={COLORS.textLight} small marginRight={rw(2)}>
              سکس
            </Text>
            <View
              style={{
                borderWidth: 3,
                borderColor: COLORS.fireEngineRed,
                borderRadius: 30,
              }}>
              <MaterialCommunityIcons
                name="circle"
                color={COLORS.white}
                size={8}
              />
            </View>
          </View>

          <View style={{ ...styles.tipContainer }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                textAlign="right"
                color={COLORS.textLight}
                size={8}
                marginRight={rw(1)}>
                (سندروم پیش از قائدگی)
              </Text>
              <Text
                textAlign="right"
                color={COLORS.textLight}
                size={8}
                marginRight={rw(1)}>
                PMS
              </Text>
            </View>
            <MaterialCommunityIcons
              name="circle"
              color={COLORS.pmsCircle}
              size={14}
            />
          </View>
          {/* <View style={{ ...styles.tipContainer }}>
            <Text color={COLORS.textLight} small marginRight={rw(2)}>
              دوره ims
            </Text>
            <MaterialCommunityIcons name="circle" color="blue" />
          </View> */}

          {/* <View style={styles.tipContainer}>
            <Text color={COLORS.textLight} small marginRight={rw(2)}>
              پیش بینی پریود
            </Text>
            <MaterialCommunityIcons name="circle" color={COLORS.orange} />
          </View> */}
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
    marginBottom: rh(2),
    // backgroundColor: 'purple',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: rw(40),
    marginHorizontal: rw(1),
    alignSelf: 'center',
    // height: rh(1),
  },
  allTipsContainer: {
    flexDirection: 'row',
    width: rw(80),
    justifyContent: 'center',
    marginTop: rh(1.7),
    marginRight: rw(12),
  },
});

export default CalendarInfo;
