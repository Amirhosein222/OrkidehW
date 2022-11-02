/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  View,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import { CommonActions } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { sendInfoApi } from '../apis';
import { getDates } from '../../../libs/helpers';

import { Text, Snackbar } from '../../../components/common';
import { COLORS, dayNumbers, rh, rw } from '../../../configs';
import { useApi } from '../../../libs/hooks';

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
  const [lastPeriodDate, setLastPeriodDate] = useState(62);
  const [periodLength, setPeriodLength] = useState(2);
  const [cycleLength, setCycleLength] = useState(6);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [disableBtn, setDisableBtn] = useState(false);

  const [sendInfo, setSendInfo] = useApi(() =>
    sendInfoApi(
      dates[lastPeriodDate],
      periodLength ? periodLength + 3 : 5,
      dayNumbers[cycleLength],
    ),
  );

  const sendInformations = async function (dontKnow = false) {
    setDisableBtn(true);
    setIsLoading(true);
    setSendInfo();
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

  useEffect(() => {
    if (sendInfo.data && sendInfo.data.is_successful) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Welcome', params: { name: displayName } }],
        }),
      );
    }
    sendInfo.data &&
      !sendInfo.data.is_successful &&
      setSnackbar({
        msg: sendInfo.data.message,
        visible: true,
      });
  }, [sendInfo]);

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
        <Text size={16} color={COLORS.textDark} bold marginTop={rh(2)}>
          {registerStage === 1
            ? 'تاریخ آخرین پریودتان'
            : registerStage === 2
            ? 'طول هر دوره پریود'
            : 'فاصله بین دو پریودتان'}
        </Text>
      </View>

      {registerStage === 1 ? (
        <Picker
          style={{ width: 160, height: 180, marginTop: rh(6) }}
          lineColor="black"
          lineGradientColorFrom="#008000"
          lineGradientColorTo="#FF5733"
          selectedValue={lastPeriodDate}
          selectedIndex={lastPeriodDate}
          itemStyle={{ color: COLORS.textDark, fontSize: 26 }}
          onValueChange={(index) => setLastPeriodDate(index)}>
          {dates.map((value, i) => (
            <PickerItem label={value} value={i} key={i} />
          ))}
        </Picker>
      ) : registerStage === 2 ? (
        <Picker
          style={{ width: 80, height: 180, marginTop: rh(6) }}
          lineColor="black"
          lineGradientColorFrom="#008000"
          lineGradientColorTo="#FF5733"
          selectedValue={periodLength}
          selectedIndex={periodLength}
          itemStyle={{ color: COLORS.textDark, fontSize: 26 }}
          onValueChange={(index) => setPeriodLength(index)}>
          {['3', '4', '5', '6', '7', '8', '9', '10'].map((value, i) => (
            <PickerItem label={value} value={i} key={i} />
          ))}
        </Picker>
      ) : registerStage === 3 ? (
        <Picker
          style={{ width: 80, height: 180, marginTop: rh(6) }}
          lineColor="black"
          lineGradientColorFrom="#008000"
          lineGradientColorTo="#FF5733"
          selectedValue={cycleLength}
          selectedIndex={cycleLength}
          itemStyle={{ color: COLORS.textDark, fontSize: 26 }}
          onValueChange={(index) => setCycleLength(index)}>
          {dayNumbers.map((value, i) => (
            <PickerItem label={value} value={i} key={i} />
          ))}
        </Picker>
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
            source={require('../../../assets/icons/btns/disabled-back.png')}
            style={{ width: 25, height: 25, marginTop: rh(0.5) }}
          />
          <Text color={COLORS.textLight}>قبلی</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', marginRight: rw(1) }}>
          <MaterialIcons
            name="circle"
            color={registerStage === 0 ? COLORS.primary : COLORS.icon}
            size={14}
            style={{ marginRight: rw(1.5) }}
          />
          <MaterialIcons
            name="circle"
            color={registerStage === 1 ? COLORS.primary : COLORS.icon}
            size={14}
            // style={{ marginHorizontal: rw(1.5) }}
          />
          <MaterialIcons
            name="circle"
            color={registerStage === 2 ? COLORS.primary : COLORS.icon}
            size={14}
            style={{ marginHorizontal: rw(1.5) }}
          />
          <MaterialIcons
            name="circle"
            color={registerStage === 3 ? COLORS.primary : COLORS.icon}
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
                : () => goToNextStage(registerStage + 1)
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 'auto',
              marginRight: rw(6),
            }}>
            <Text color={COLORS.borderLinkBtn}>بعدی</Text>
            <Image
              source={require('../../../assets/icons/btns/enabled-next.png')}
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
