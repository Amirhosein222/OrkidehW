/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';

import { Reminder, ReminderTextInput } from './components';
import {
  ScreenHeader,
  Divider,
  BackgroundView,
  Snackbar,
} from '../../../components/common';

import { setReminderApi, getRemindersApi } from './api';
import { useApi, useIsPeriodDay } from '../../../libs/hooks';
import { handleReminderValue } from './helpers/handleReminderValue';
import { handleReminderDefaultTime } from './helpers/handleReminderDefaultTime';
import { handleReminderDefaultText } from './helpers/handleReminderDefaultText';
import { COLORS, rh, rw } from '../../../configs';

const RemindersScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showPicker, setShowPicker] = useState();
  const [timeType, setTimeType] = useState();
  const [pTime, setPtime] = useState();
  const [oTime, setOtime] = useState();
  const [pmsTime, setPmsTime] = useState();
  const [dTime, setDtime] = useState();
  const [pText, setPText] = useState();
  const [oText, setOText] = useState();
  const [pmsText, setPmsText] = useState();
  const [dText, setDText] = useState();
  const selectedReminder = useRef({
    type: '',
    status: '',
    time: '',
    description: '',
  });
  const [getReminders, setGetReminder] = useApi(() => getRemindersApi());
  const [reminder, setReminder] = useApi(() =>
    setReminderApi(selectedReminder.current),
  );

  const handleReminderStatus = rem => {
    selectedReminder.current = {
      ...selectedReminder.current,
      ...rem,
      description:
        rem.type === 'period_f'
          ? pText
          : rem.type === 'ovulation_f'
          ? oText
          : rem.type === 'pms_f'
          ? pmsText
          : dText,
      time:
        rem.type === 'period_f'
          ? pTime
          : rem.type === 'ovulation_f'
          ? oTime
          : rem.type === 'pms_f'
          ? pmsTime
          : dTime,
    };
    setReminder();
  };
  const handleReminderText = (type, txt) => {
    switch (type) {
      case 'period_f':
        setPText(txt);
        break;
      case 'ovulation_f':
        setOText(txt);
        break;
      case 'pms_f':
        setPmsText(txt);
        break;
      case 'drug':
        setDText(txt);
        break;
      default:
        break;
    }
  };
  const handleReminderTime = time => {
    switch (timeType) {
      case 'period_f':
        setPtime(time);
        break;
      case 'ovulation_f':
        setOtime(time);
        break;
      case 'pms_f':
        setPmsTime(time);
        break;
      case 'drug':
        setDtime(time);
        break;
      default:
        break;
    }
    setShowPicker(false);
  };
  const handleDefaultValue = type => {
    return handleReminderValue(getReminders.data.data, type);
  };
  const handleDefaultTime = type => {
    return handleReminderDefaultTime(getReminders.data.data, type);
  };
  const handleDefaultText = type => {
    return handleReminderDefaultText(getReminders.data.data, type);
  };

  const handleOpenPicker = type => {
    setTimeType(type);
    setShowPicker(!showPicker);
  };
  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const handleInitialValues = () => {
    setPtime(handleReminderDefaultTime(getReminders.data.data, 'period_f'));
    setOtime(handleReminderDefaultTime(getReminders.data.data, 'ovulation_f'));
    setPmsTime(handleReminderDefaultTime(getReminders.data.data, 'pms_f'));
    setDtime(handleReminderDefaultTime(getReminders.data.data, 'drug'));
    setPText(handleReminderDefaultText(getReminders.data.data, 'period_f'));
    setOText(handleReminderDefaultText(getReminders.data.data, 'ovulation_f'));
    setPmsText(handleReminderDefaultText(getReminders.data.data, 'pms_f'));
    setDText(handleReminderDefaultText(getReminders.data.data, 'drug'));
  };

  useEffect(() => {
    setShowPicker(false);

    () => {
      setShowPicker();
      setPtime();
      setOtime();
      setPmsTime();
      setDtime();
      setPText();
      setOText();
      setPmsText();
      setDText();
    };
  }, []);

  useEffect(() => {
    setGetReminder();
  }, []);

  useEffect(() => {
    if (reminder.data && reminder.data.is_successful) {
      setSnackbar({
        msg:
          reminder.data.data.send_notif === '1'
            ? 'یادآور با موفقیت فعال شد'
            : 'یادآور با موفقیت غیر فعال شد',
        visible: true,
        type: 'success',
      });
    }
    reminder.data &&
      !reminder.data.is_successful &&
      setSnackbar({
        msg: JSON.stringify(reminder.data.message),
        visible: true,
      });
  }, [reminder]);

  useEffect(() => {
    if (getReminders.data && getReminders.data.is_successful) {
      handleInitialValues();
    }
    getReminders.data &&
      !getReminders.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [getReminders]);

  return (
    <BackgroundView>
      <ScreenHeader title="یادآور ها" />
      {getReminders.data && getReminders.data.is_successful ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Reminder
            disable={reminder.isFetching}
            type="period_f"
            title="یادآوری چند روز قبل از قاعدگی"
            onSwitch={handleReminderStatus}
            handleDefaultValue={handleDefaultValue}
            handleTimeType={setTimeType}
          />
          <ReminderTextInput
            handleDefaultTime={handleDefaultTime}
            handleDefaultText={handleDefaultText}
            setText={handleReminderText}
            openPicker={handleOpenPicker}
            time={pTime}
            text={pText}
            type="period_f"
          />

          <Divider
            color={COLORS.textDark}
            width="95%"
            style={{ marginTop: rh(4) }}
            borderWidth={0.6}
          />
          <Reminder
            disable={reminder.isFetching}
            type="ovulation_f"
            title="یادآوری چند روز قبل از تخم گذاری"
            onSwitch={handleReminderStatus}
            handleDefaultValue={handleDefaultValue}
            handleTimeType={setTimeType}
          />
          <ReminderTextInput
            handleDefaultTime={handleDefaultTime}
            handleDefaultText={handleDefaultText}
            setText={handleReminderText}
            openPicker={handleOpenPicker}
            time={oTime}
            text={oText}
            type="ovulation_f"
          />
          <Divider
            color={COLORS.textDark}
            width="95%"
            style={{ marginTop: rh(4) }}
            borderWidth={0.6}
          />
          <Reminder
            disable={reminder.isFetching}
            type="pms_f"
            title="یادآوری چند روز قبل از PMS"
            onSwitch={handleReminderStatus}
            handleDefaultValue={handleDefaultValue}
            handleTimeType={setTimeType}
          />
          <ReminderTextInput
            handleDefaultTime={handleDefaultTime}
            handleDefaultText={handleDefaultText}
            setText={handleReminderText}
            openPicker={handleOpenPicker}
            time={pmsTime}
            text={pmsText}
            type="pms_f"
          />
          <Divider
            color={COLORS.textDark}
            width="95%"
            style={{ marginTop: rh(4) }}
            borderWidth={0.6}
          />
          <Reminder
            disable={reminder.isFetching}
            type="drug"
            title="یادآوری شروع قرص"
            onSwitch={handleReminderStatus}
            handleDefaultValue={handleDefaultValue}
            handleTimeType={setTimeType}
          />
          <ReminderTextInput
            handleDefaultTime={handleDefaultTime}
            handleDefaultText={handleDefaultText}
            setText={handleReminderText}
            openPicker={handleOpenPicker}
            time={dTime}
            text={dText}
            type="drug"
          />
        </ScrollView>
      ) : (
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      )}

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
      {showPicker ? (
        <DatePicker
          // current={new Date()}
          isGregorian={false}
          options={{
            backgroundColor: COLORS.icon,
            textHeaderColor: '#FFA25B',
            textDefaultColor: COLORS.white,
            selectedTextColor: COLORS.primary,
            mainColor: COLORS.white,
            textSecondaryColor: COLORS.textLight,
            borderColor: 'rgba(122, 146, 165, 0.6)',
            textFontSize: 20,
            textHeaderFontSize: 24,
            defaultFont: 'IRANYekanMobileBold',
            headerFont: 'IRANYekanMobileBold',
          }}
          style={{ height: 200 }}
          mode="time"
          minuteInterval={3}
          onTimeChange={selectedTime => handleReminderTime(selectedTime)}
        />
      ) : null}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
    alignItems: 'center',
    width: rw(100),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    marginTop: rh(2),
    paddingBottom: rh(4),
  },
});

export default RemindersScreen;
