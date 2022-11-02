/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from '@mohamadkh75/react-native-jalali-datepicker';

import { Button, Text } from '../common';
import { rw, rh, COLORS, ICON_SIZE } from '../../configs';

import EnableCheck from '../../assets/icons/btns/enabled-check.svg';
import DisableCheck from '../../assets/icons/btns/disabled-check.svg';
import Close from '../../assets/icons/btns/close.svg';

const SelectBirthDayModal = ({
  visible,
  closeModal,
  setBirthday,
  atProfile = { profile: false, isPeriodDay: false },
  updateBirthday = null,
  isUpdating = false,
}) => {
  const birthday = useRef(null);
  const onSelectDate = () => {
    if (atProfile.profile) {
      updateBirthday('', birthday.current);
      return;
    }
    setBirthday(birthday.current);
    closeModal();
  };
  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      coverScreen={true}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={0}
      animationOutTiming={0}
      animationInTiming={0}
      animationIn="slideInUp"
      onBackdropPress={isUpdating ? () => {} : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            onPress={isUpdating ? () => {} : closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Close style={{ ...ICON_SIZE, ...styles.closeIcon }} />
          </Pressable>
        </View>
        <DatePicker
          style={{
            width: rw(100),
            height: rh(45),
            alignSelf: 'center',
            backgroundColor: COLORS.mainBg,
            marginTop: rh(1),
          }}
          selected="1390/1/18"
          dateSeparator="/"
          minDate="1350/1/18"
          maxDate="1399/12/29"
          headerContainerStyle={{ height: '15%' }}
          yearMonthBoxStyle={{
            width: '30%',
            height: '75%',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: COLORS.textCommentCal,
          }}
          yearMonthTextStyle={{
            fontSize: 22,
            color: COLORS.textCommentCal,
            fontFamily: 'IRANYekanMobileBold',
          }}
          iconContainerStyle={{ width: `${100 / 7}%` }}
          backIconStyle={{
            width: 20,
            height: 20,
            resizeMode: 'center',
            tintColor: COLORS.textLight,
          }}
          nextIconStyle={{
            width: 20,
            height: 20,
            resizeMode: 'center',
            tintColor: COLORS.textLight,
          }}
          eachYearStyle={{
            width: 110,
            height: 82,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              atProfile.profile && atProfile.isPeriodDay
                ? COLORS.fireEngineRed
                : COLORS.primary,
            marginTop: '1.5%',
            marginBottom: 5,
            marginHorizontal: '1.5%',
            borderRadius: 10,
            elevation: 3,
          }}
          eachYearTextStyle={{
            fontSize: 16,
            color: 'white',
            fontFamily: 'IRANYekanMobileBold',
          }}
          eachMonthStyle={{
            width: `${88 / 3}%`,
            height: `${88 / 4}%`,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              atProfile.profile && atProfile.isPeriodDay
                ? COLORS.fireEngineRed
                : COLORS.primary,
            marginBottom: '3%',
            borderRadius: 10,
            elevation: 3,
          }}
          eachMonthTextStyle={{
            fontSize: 16,
            color: 'white',
            fontFamily: 'IRANYekanMobileBold',
          }}
          weekdaysContainerStyle={{ height: '10%' }}
          weekdayStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          weekdayTextStyle={{
            fontSize: 16,
            color: COLORS.textCommentCal,
            marginBottom: 5,
            fontFamily: 'IRANYekanMobileBold',
          }}
          borderColor={COLORS.textLight}
          dayStyle={{
            width: `${100 / 7}%`,
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: 1 / 1,
          }}
          selectedDayStyle={{
            width: '70%',
            aspectRatio: 1 / 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
          }}
          selectedDayColor={
            atProfile.profile && atProfile.isPeriodDay
              ? COLORS.fireEngineRed
              : COLORS.primary
          }
          dayTextStyle={{
            fontSize: 18,
            fontFamily: 'IRANYekanMobileBold',
            // color: COLORS.textLight,
          }}
          selectedDayTextColor="white"
          dayTextColor={COLORS.textLight}
          disabledTextColor="#4bcffa66"
          onDateChange={(date) => {
            birthday.current = date;
          }}
        />

        <Button
          title={atProfile.profile ? 'تایید اطلاعات' : 'انتخاب'}
          Icon={[
            () => <DisableCheck style={ICON_SIZE} />,
            () => <EnableCheck style={ICON_SIZE} />,
          ]}
          color={
            atProfile.profile && atProfile.isPeriodDay
              ? COLORS.fireEngineRed
              : COLORS.primary
          }
          onPress={onSelectDate}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
          loading={isUpdating}
          disabled={isUpdating}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  content: {
    alignItems: 'center',
    width: rw(100),
    height: rh(65),
    marginTop: 'auto',
    elevation: 5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: rh(2),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
  row: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: rh(2.5),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textDark,
    paddingBottom: rh(2),
  },
  deleteContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: rh(2),
  },
});
export default SelectBirthDayModal;
