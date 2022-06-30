/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text, RowContainer } from '../../components/common';
import { COLORS, rh, rw } from '../../configs';

const CalendarInfo = ({
  showBtns,
  handleSelectedOption,
  selectedOption = null,
}) => {
  return (
    <View style={styles.container}>
      {showBtns ? (
        <RowContainer justifyContent="space-evenly">
          <Button
            color={selectedOption === 'sex' ? COLORS.red : COLORS.white}
            mode="contained"
            style={styles.btn}
            onPress={() => handleSelectedOption('sex')}>
            <Text
              color={selectedOption === 'sex' ? COLORS.white : COLORS.red}
              small>
              رابطه زناشویی
            </Text>
          </Button>
          <Button
            color={selectedOption === 'period' ? COLORS.pink : COLORS.white}
            mode="contained"
            style={styles.btn}
            onPress={() => handleSelectedOption('period')}>
            <Text
              color={selectedOption === 'period' ? COLORS.white : COLORS.pink}
              small>
              دوره پریودی
            </Text>
          </Button>
        </RowContainer>
      ) : (
        <View>
          <View style={styles.topTipsContainer}>
            <View style={styles.tipContainer}>
              <MaterialCommunityIcons
                name="circle"
                color={COLORS.darkYellow}
                style={{ marginRight: 5 }}
              />
              <Text color={COLORS.darkYellow} small>
                تخمک گذاری
              </Text>
            </View>

            <View style={styles.tipContainer}>
              <MaterialCommunityIcons
                name="circle"
                color={COLORS.darkRed}
                style={{ marginRight: 5 }}
              />
              <Text color={COLORS.darkRed} small>
                پی ام اس
              </Text>
            </View>

            <View style={styles.tipContainer}>
              <MaterialCommunityIcons
                name="circle"
                color={COLORS.pink}
                style={{ marginRight: 5 }}
              />
              <Text color={COLORS.pink} small>
                دوره پریودی
              </Text>
            </View>
          </View>

          <View style={styles.bottomTipsContainer}>
            <View style={{ ...styles.tipContainer, marginRight: rw(5) }}>
              <MaterialCommunityIcons
                name="circle"
                color={COLORS.red}
                style={{ marginRight: 5 }}
              />
              <Text color={COLORS.red} small marginRight="10">
                رابطه زناشویی
              </Text>
            </View>

            <View style={styles.tipContainer}>
              <MaterialCommunityIcons
                name="circle"
                color={COLORS.orange}
                style={{ marginRight: 5 }}
              />
              <Text textAlign="right" color={COLORS.orange} small>
                پیش بینی پریود
              </Text>
            </View>
          </View>
        </View>
      )}
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
  },
  bottomTipsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: rw(90),
    marginTop: rh(2),
  },
  topTipsContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: rw(90),
    marginTop: rh(2),
  },
});

export default CalendarInfo;
