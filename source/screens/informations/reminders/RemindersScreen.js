/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { StyleSheet, ScrollView, View, Image, TextInput } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { Reminder, ReminderTextInput } from './components';
import {
  ScreenHeader,
  Divider,
  BackgroundView,
} from '../../../components/common';

import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { baseUrl, COLORS, rh, rw } from '../../../configs';

const RemindersScreen = ({ navigation }) => {
  const { fullInfo } = useContext(WomanInfoContext);
  const [reminderText, setReminderText] = useState('');

  return (
    <BackgroundView>
      <ScreenHeader title="یادآور ها" />
      <ScrollView contentContainerStyle={styles.content}>
        <Reminder title="یادآوری چند روز قبل از قاعدگی" />
        <ReminderTextInput setText={setReminderText} />

        <Divider
          color={COLORS.textDark}
          width="95%"
          style={{ marginTop: rh(4) }}
          borderWidth={0.6}
        />
        <Reminder title="یادآوری چند روز قبل از تخم گذاری" />
        <ReminderTextInput setText={setReminderText} />
        <Divider
          color={COLORS.textDark}
          width="95%"
          style={{ marginTop: rh(4) }}
          borderWidth={0.6}
        />
        <Reminder title="یادآوری چند روز قبل از PMS" />
        <ReminderTextInput setText={setReminderText} />
        <Divider
          color={COLORS.textDark}
          width="95%"
          style={{ marginTop: rh(4) }}
          borderWidth={0.6}
        />
        <Reminder title="یادآوری شروع قرص" />
        <ReminderTextInput setText={setReminderText} />
      </ScrollView>
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

  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '80%',
    alignSelf: 'center',
    marginTop: rh(2),
  },
  inputArea: {
    backgroundColor: COLORS.inputTabBarBg,
    height: rh(20),
    width: rw(81),
    borderRadius: 10,
    color: COLORS.textLight,
    fontFamily: 'Qs_Iranyekan_bold',
    textAlign: 'right',
    textAlignVertical: 'top',
    fontSize: 14,
  },
});

export default RemindersScreen;
