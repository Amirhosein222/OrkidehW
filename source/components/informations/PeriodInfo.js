/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import WheelPicker from 'react-native-wheely/src';
import Picker from '@gregfrench/react-native-wheel-picker';
import FormData from 'form-data';
import { CommonActions } from '@react-navigation/native';

import getWomanClient from '../../libs/api/womanApi';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';
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
  const [isLoadingDontKnow, setIsLoadingDontKnow] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [periodLength, setPeriodLength] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [disableBtn, setDisableBtn] = useState(false);

  const sendInformations = async function (dontKnow = false) {
    const womanClient = await getWomanClient();
    setDisableBtn(true);
    if (dontKnow === true) {
      setIsLoadingDontKnow(true);
      const formData = new FormData();
      formData.append('last_period_date', dates[lastPeriodDate]);
      formData.append('period_length', 3);
      formData.append('cycle_length', 21);
      womanClient.post('store/period_info', formData).then((response) => {
        setDisableBtn(false);
        setIsLoadingDontKnow(false);
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
    } else {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('last_period_date', dates[lastPeriodDate]);
      formData.append('period_length', periodLength);
      formData.append('cycle_length', dayNumbers[cycleLength]);
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
    }
  };
  const iDontKnow = function () {
    setPeriodLength('');
    goToNextStage(registerStage + 1);
  };
  const handleNextStage = function () {
    if (!lastPeriodDate) {
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
  useEffect(() => {
    const backAction = () => {
      goToNextStage(registerStage - 1);
      return true;
    };

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
          marginTop: rh(1.5),
          flexDirection: 'row',
          flexShrink: 1,
          width: rw(100),
          justifyContent: 'center',
        }}>
        <Text medium color={COLORS.red} marginRight={5} bold>
          {registerStage === 2 ? 'قشنگم،' : 'جونم،'}
        </Text>
        <Text medium color={COLORS.red} bold>
          {displayName}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: rw(4),
          flexDirection: 'row',
          flexShrink: 1,
          width: rw(100),
          justifyContent: 'center',
        }}>
        <Text medium color={COLORS.red} marginTop={rh(0)} bold>
          {registerStage === 2
            ? 'برای اینکه بتونیم همراه بهتری برات باشیم، نیاز داریم که تاریخ شروع آخرین پریودت رو بدونیم'
            : registerStage === 3
            ? 'لطفا به ما بگو طول هر دوره ی پریودت حدودا چند روزه؟'
            : 'لطفا به ما بگو فاصله ی بین هر دوره ی پریودت حدودا چند روزه؟'}
        </Text>
      </View>

      {registerStage === 1 ? (
        <Icon
          name="calendar"
          size={34}
          color={COLORS.red}
          style={{
            alignSelf: 'flex-end',
            right: 50,
            top: 50,
          }}
        />
      ) : null}

      {registerStage === 2 ? (
        <Picker
          style={{ width: 160, height: 180, marginTop: rh(4) }}
          lineColor="black"
          lineGradientColorFrom="#008000"
          lineGradientColorTo="#FF5733"
          selectedValue={lastPeriodDate}
          itemStyle={{ color: COLORS.pink, fontSize: 26 }}
          onValueChange={(index) => setLastPeriodDate(index)}>
          {dates.map((value, i) => (
            <PickerItem label={value} value={i} key={i} />
          ))}
        </Picker>
      ) : registerStage === 3 ? (
        <WheelPicker
          options={['3', '4', '5', '6', '7', '8', '9', '10']}
          onChange={(pLength) => setPeriodLength(pLength)}
          itemHeight={50}
          itemTextStyle={{
            fontFamily: 'Vazir',
            fontSize: 24,
            color: COLORS.red,
          }}
          containerStyle={{ alignItems: 'center', marginTop: rh(6) }}
          selectedIndicatorStyle={styles.lengthWheel}
        />
      ) : registerStage === 4 ? (
        <Picker
          style={{ width: 80, height: 180, marginTop: rh(6) }}
          lineColor="black"
          lineGradientColorFrom="#008000"
          lineGradientColorTo="#FF5733"
          selectedValue={lastPeriodDate}
          itemStyle={{ color: COLORS.pink, fontSize: 26 }}
          onValueChange={(index) => setCycleLength(index)}>
          {dayNumbers.map((value, i) => (
            <PickerItem label={value} value={i} key={i} />
          ))}
        </Picker>
      ) : null}

      <View style={styles.btnCotainer}>
        <Button
          mode="contained"
          color={COLORS.red}
          icon="chevron-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
          disabled={disableBtn ? true : false}
          onPress={
            registerStage === 4
              ? () => sendInformations()
              : () => handleNextStage()
          }
          loading={isLoading ? true : false}
          style={styles.btn}>
          <Text bold color="white">
            بعدی
          </Text>
        </Button>

        {registerStage !== 2 ? (
          <Button
            mode="outlined"
            color={COLORS.red}
            // icon="chevron-right"
            contentStyle={{ flexDirection: 'row-reverse' }}
            disabled={disableBtn ? true : false}
            onPress={
              registerStage === 4
                ? () => sendInformations(true)
                : () => iDontKnow()
            }
            loading={isLoadingDontKnow ? true : false}
            style={styles.btn}>
            <Text bold color={COLORS.red}>
              نمیدونم
            </Text>
          </Button>
        ) : null}
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
  numberContainer: {
    width: '12%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pink,
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
    backgroundColor: COLORS.lightPink,
    width: '15%',
    borderRadius: 40,
  },
});

export default PeriodInfo;
