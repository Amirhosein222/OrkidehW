/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalDatePicker from '@logisticinfotech/react-native-horizontal-date-picker';
import { useNavigation } from '@react-navigation/native';

import { useIsPeriodDay } from '../../../libs/hooks';
import { COLORS, rw } from '../../../configs';

const HDatePicker = ({ onDateSelect, isFetching }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <HorizontalDatePicker
      pickerType={'date'}
      onDateSelected={onDateSelect}
      minDate={new Date(Date.now() - 12096e5)}
      maxDate={new Date()}
      dayFormat="jDD"
      monthFormat="jMMMM"
      isShowYear={false}
      returnDateFormat={'jYYYY/jMM/jDD'}
      datePickerContainerStyle={{
        backgroundColor: 'transparent',
        width: rw(100),
      }}
      selectedTextStyle={styles.selectedDate}
      unSelectedTextStyle={styles.unselectedDate}
      isPeriodDay={isPeriodDay}
      defaultSelected={new Date()}
    />
  );
};

const styles = StyleSheet.create({
  selectedDate: {
    fontFamily: 'IRANYekanMobileBold',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  unselectedDate: {
    fontFamily: 'IRANYekanMobileBold',
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.textLight,
  },
});

export default HDatePicker;
