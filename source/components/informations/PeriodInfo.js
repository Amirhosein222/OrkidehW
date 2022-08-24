/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  Image,
  Pressable,
  View,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import FormData from 'form-data';
import { CommonActions } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import getWomanClient from '../../libs/api/womanApi';
import { getDates } from '../../libs/helpers';

import { Text, Snackbar } from '../common';
import { COLORS, dayNumbers, rh, rw } from '../../configs';

let PickerItem = Picker.Item;

const PeriodInfo = ({
  navigation,
  registerStage,
  goToNextStage,
  displayName,
  firstDay,
}) => {
  const dates = getDates(firstDay);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [periodLength, setPeriodLength] = useState('');
  const [cycleLength, setCycleLength] = useState(0);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [disableBtn, setDisableBtn] = useState(false);
  const [dontKnowPeriodDate, setDontKnowPeriodDate] = useState(false);
  const [dontKnowPeriodLength, setDontKnowPeriodLength] = useState(false);
  const [dontKnowBetweenPeriods, setDontKnowBetweenPeriods] = useState(false);

  const sendInformations = async function (dontKnow = false) {
    const womanClient = await getWomanClient();
    setDisableBtn(true);
    setIsLoading(true);
    const formData = new FormData();
    formData.append('last_period_date', dates[lastPeriodDate]);
    formData.append(
      'period_length',
      dontKnowPeriodLength ? 3 : periodLength + 3,
    );
    formData.append(
      'cycle_length',
      dontKnowBetweenPeriods ? 21 : dayNumbers[cycleLength],
    );
    womanClient.post('store/period_info', formData).then((response) => {
      setDisableBtn(false);
      setIsLoading(false);
      if (response.data.is_successful) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Welcome', params: { name: displayName } }],
          }),
        );
      } else {
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };
  const handleNextStage = function () {
    if (!lastPeriodDate && !dontKnowPeriodDate) {
      setSnackbar({
        msg: 'لطفا تاریخ آخرین پریودتون را انتخاب کنید!',
        visible: true,
      });
    } else {
      goToNextStage(registerStage + 1);
    }
  };
  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  const backAction = () => {
    goToNextStage(registerStage - 1);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  return (
    <View style={styles.content}>
      <View
        style={{
          paddingHorizontal: rw(4),
          flexDirection: 'row',
          flexShrink: 1,
          width: rw(100),
          justifyContent: 'center',
        }}>
        <Text medium color={COLORS.textDark} bold marginTop={rh(2)}>
          {registerStage === 1
            ? 'تاریخ آخرین پریودتان'
            : registerStage === 2
            ? 'طول هر دوره پریود'
            : 'فاصله بین دو پریودتان'}
        </Text>
      </View>

      {registerStage === 1 ? (
        <>
          <Picker
            style={{ width: 160, height: 180, marginTop: rh(6) }}
            lineColor="black"
            lineGradientColorFrom="#008000"
            lineGradientColorTo="#FF5733"
            selectedValue={lastPeriodDate}
            itemStyle={{ color: COLORS.textDark, fontSize: 26 }}
            onValueChange={(index) => setLastPeriodDate(index)}>
            {dates.map((value, i) => (
              <PickerItem label={value} value={i} key={i} />
            ))}
          </Picker>
          <View style={styles.checkBoxContainer}>
            <Text
              color={dontKnowPeriodDate ? COLORS.primary : COLORS.textLight}>
              تاریخ آخرین پریود خود را فراموش کرده ام
            </Text>
            <Checkbox
              uncheckedColor={COLORS.textLight}
              color={COLORS.primary}
              disabled={isLoading ? true : false}
              status={dontKnowPeriodDate ? 'checked' : 'unchecked'}
              onPress={() => {
                setDontKnowPeriodDate(!dontKnowPeriodDate);
              }}
            />
          </View>
        </>
      ) : registerStage === 2 ? (
        <>
          <Picker
            style={{ width: 80, height: 180, marginTop: rh(6) }}
            lineColor="black"
            lineGradientColorFrom="#008000"
            lineGradientColorTo="#FF5733"
            selectedValue={periodLength}
            itemStyle={{ color: COLORS.textDark, fontSize: 26 }}
            onValueChange={(index) => setPeriodLength(index)}>
            {['3', '4', '5', '6', '7', '8', '9', '10'].map((value, i) => (
              <PickerItem label={value} value={i} key={i} />
            ))}
          </Picker>
          <View style={styles.checkBoxContainer}>
            <Text
              color={dontKnowPeriodLength ? COLORS.primary : COLORS.textLight}>
              طول هر دوره پریودم را نمیدانم
            </Text>
            <Checkbox
              uncheckedColor={COLORS.textLight}
              color={COLORS.primary}
              disabled={isLoading ? true : false}
              status={dontKnowPeriodLength ? 'checked' : 'unchecked'}
              onPress={() => {
                setDontKnowPeriodLength(!dontKnowPeriodLength);
              }}
            />
          </View>
        </>
      ) : registerStage === 3 ? (
        <>
          <Picker
            style={{ width: 80, height: 180, marginTop: rh(6) }}
            lineColor="black"
            lineGradientColorFrom="#008000"
            lineGradientColorTo="#FF5733"
            selectedValue={cycleLength}
            itemStyle={{ color: COLORS.textDark, fontSize: 26 }}
            onValueChange={(index) => setCycleLength(index)}>
            {dayNumbers.map((value, i) => (
              <PickerItem label={value} value={i} key={i} />
            ))}
          </Picker>
          <View style={styles.checkBoxContainer}>
            <Text
              color={
                dontKnowBetweenPeriods ? COLORS.primary : COLORS.textLight
              }>
              فاصله بین دو پریودم را نمیدانم
            </Text>
            <Checkbox
              uncheckedColor={COLORS.textLight}
              color={COLORS.primary}
              disabled={isLoading ? true : false}
              status={dontKnowBetweenPeriods ? 'checked' : 'unchecked'}
              onPress={() => {
                setDontKnowBetweenPeriods(!dontKnowBetweenPeriods);
              }}
            />
          </View>
        </>
      ) : null}
      <View style={styles.stepperContainer}>
        <Pressable
          hitSlop={7}
          disabled={disableBtn ? true : false}
          onPress={backAction}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 'auto',
            marginLeft: rw(6),
          }}>
          <Image
            source={require('../../assets/icons/btns/disabled-back.png')}
            style={{ width: 25, height: 25, marginTop: rh(0.5) }}
          />
          <Text color={COLORS.textLight}>قبلی</Text>
        </Pressable>

        <View style={{ flexDirection: 'row' }}>
          <MaterialIcons
            name="circle"
            color={registerStage === 0 ? COLORS.primary : COLORS.icon}
            size={14}
          />
          <MaterialIcons
            name="circle"
            color={registerStage === 1 ? COLORS.primary : COLORS.icon}
            size={14}
            style={{ marginHorizontal: rw(1.5) }}
          />
          <MaterialIcons
            name="circle"
            color={
              registerStage === 2 || registerStage === 3
                ? COLORS.primary
                : COLORS.icon
            }
            size={14}
          />
        </View>

        {isLoading && registerStage === 3 ? (
          <View
            style={{
              flexDirection: 'row',
              width: rw(18),
              justifyContent: 'flex-end',
              paddingRight: rw(4),
            }}>
            <ActivityIndicator size="small" color={COLORS.borderLinkBtn} />
          </View>
        ) : (
          <Pressable
            hitSlop={7}
            disabled={disableBtn ? true : false}
            onPress={
              registerStage === 3
                ? () => sendInformations()
                : () => handleNextStage()
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 'auto',
              marginRight: rw(6),
            }}>
            <Text color={COLORS.borderLinkBtn}>بعدی</Text>
            <Image
              source={require('../../assets/icons/btns/enabled-next.png')}
              style={{ width: 25, height: 25, marginTop: rh(0.5) }}
            />
          </Pressable>
        )}
      </View>
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
    justifyContent: 'center',
  },
  userIcon: {
    width: 89,
    height: 89,
    backgroundColor: COLORS.lightPink,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  calendarCon: {
    width: '100%',
    justifyContent: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  numberContainer: {
    width: '12%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 50,
  },
  btnCotainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: rw(40),
    marginTop: 'auto',
    marginBottom: rh(6),
  },
  btn: {
    width: '65%',
    height: 40,
    borderRadius: 40,
    marginTop: rh(2),
    justifyContent: 'center',
  },
  lengthWheel: {
    backgroundColor: COLORS.primary,
    width: '13%',
    borderRadius: 40,
  },
  stepperContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: rw(100),
    marginBottom: rh(4),
    marginTop: 'auto',
    alignItems: 'center',
  },
});

export default PeriodInfo;
