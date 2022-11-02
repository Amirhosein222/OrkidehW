/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

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
import { COLORS, rh, rw } from '../../../configs';

const RemindersScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [reminderText, setReminderText] = useState('');
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const selectedReminder = useRef({
    type: '',
    status: '',
  });
  const [getReminders, setGetReminder] = useApi(() => getRemindersApi());
  const [reminder, setReminder] = useApi(() =>
    setReminderApi(selectedReminder.current),
  );

  const handleReminderStatus = rem => {
    selectedReminder.current = rem;
    setReminder();
  };
  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  const handleDefaultValue = type => {
    return handleReminderValue(getReminders.data.data, type);
  };

  useEffect(() => {
    setGetReminder();
  }, []);

  useEffect(() => {
    if (reminder.data && reminder.data.is_successful) {
      setSnackbar({
        msg:
          reminder.data.data.send_notif === '1'
            ? 'یادآور فعال شد'
            : 'یادآور غیر فعال شد',
        visible: true,
        type: reminder.data.data.send_notif === '1' ? 'success' : 'error',
      });
    }
    reminder.data &&
      !reminder.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [reminder]);

  useEffect(() => {
    if (getReminders.data && getReminders.data.is_successful) {
      // console.log('getReminders.data ', getReminders.data.data[0].type);
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
          />
          <ReminderTextInput setText={setReminderText} />

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
          />
          <ReminderTextInput setText={setReminderText} />
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
          />
          <ReminderTextInput setText={setReminderText} />
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
          />
          <ReminderTextInput setText={setReminderText} />
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
