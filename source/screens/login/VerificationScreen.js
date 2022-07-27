/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StatusBar, StyleSheet, Keyboard } from 'react-native';
import { Button } from 'react-native-paper';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import CountDown from 'react-native-countdown-component';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authApi from '../../libs/api/authApi';

import { Container, Text, Divider, Snackbar } from '../../components/common';
import { COLORS, rh, rw } from '../../configs';

const CELL_COUNT = 4;

const VerificationScreen = ({ navigation, route }) => {
  const params = route.params;
  const [code, setCode] = useState('');
  const [checkingCode, setCheckingCode] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCode, setResendCode] = useState(false);
  const [timer, setTimer] = useState(60);
  const ref = useBlurOnFulfill({ code, cellCount: CELL_COUNT });
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    code,
    setCode,
  });
  const validateInput = function () {
    if (code.length !== 4) {
      setSnackbar({
        msg: 'لطفا کد را وارد کنید!',
        visible: true,
      });
      return false;
    } else {
      return true;
    }
  };
  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  const onPressCheckCode = function () {
    if (validateInput() === false) {
      return;
    }
    setCheckingCode(true);
    const formData = new FormData();
    formData.append('mobile', params.mobile);
    formData.append('activation_code', code);
    formData.append('gender', 'woman');
    authApi
      .post('check_activation_code', formData)
      .then(async (response) => {
        setCheckingCode(false);
        if (response.data.is_successful) {
          await AsyncStorage.setItem(
            'userToken',
            JSON.stringify(response.data.data.token),
          );
          const periodStart = await AsyncStorage.getItem('periodStart');
          periodStart && (await AsyncStorage.removeItem('periodStart'));
          await AsyncStorage.setItem('logedOut', 'false');
          navigation.navigate('EnterInfo');
        } else {
          setSnackbar({
            msg: response.data.message,
            visible: true,
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      });
  };

  const onPressSendCode = function () {
    setResending(true);
    const formData = new FormData();
    formData.append('mobile', params.mobile);
    formData.append('gender', 'woman');
    authApi
      .post('send_activation_code', formData)
      .then((response) => {
        setResending(false);
        if (response.data.is_successful) {
          setSnackbar({
            msg: response.data.data,
            visible: true,
          });
          setCode('');
          setResendCode(!resendCode);
          setTimer(60 * 2);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      })
      .catch((e) => {
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      });
  };
  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Text large bold color={COLORS.dark}>
        تایید کد فعالسازی
      </Text>
      <Text color={COLORS.grey} marginTop={rh(0.5)}>
        عزیزم کد فعالسازی رو به شماره {params.mobile} ارسال کردیم.
      </Text>

      <View>
        <View style={{ paddingHorizontal: rw(4), marginTop: rh(1) }}>
          <Text color={COLORS.grey}>
            اگر لازم داری که دوباره کد برات ارسال بشه،باید تا صفر شدن ثانیه شمار
            صبر کنی.
          </Text>
        </View>
        <View style={styles.counterContainer}>
          <Button
            color={COLORS.pink}
            mode="contained"
            style={[styles.btn, { width: '40%', height: 30, marginTop: 20 }]}
            disabled={!resendCode ? true : false}
            loading={resending ? true : false}
            onPress={() => onPressSendCode()}>
            <Text color="white"> ارسال مجدد کد</Text>
          </Button>
          <CountDown
            size={20}
            until={timer}
            onFinish={() => setResendCode(true)}
            digitStyle={{
              backgroundColor: '#FFF',
            }}
            digitTxtStyle={{ color: COLORS.dark }}
            timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
            separatorStyle={{ color: COLORS.dark }}
            timeToShow={['M', 'S']}
            timeLabels={{ m: null, s: null }}
            showSeparator
          />
        </View>
      </View>

      <Divider color={COLORS.pink} width="90%" style={{ marginTop: 20 }} />

      <View style={{ paddingHorizontal: rw(1), marginTop: rh(2) }}>
        <Text bold color={COLORS.dark}>
          لطفا عدد چهار رقمی که برات پیامک کردیم رو اینجا وارد کن.
        </Text>
      </View>

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        onEndEditing={() => Keyboard.dismiss()}
        onSubmitEditing={() => Keyboard.dismiss()}
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            color={COLORS.pink}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      <Button
        color={COLORS.pink}
        mode="contained"
        style={styles.btn}
        loading={checkingCode ? true : false}
        disabled={checkingCode ? true : false}
        onPress={() => onPressCheckCode()}>
        <Text color="white">تایید</Text>
      </Button>

      <Divider color={COLORS.pink} width="90%" style={{ marginTop: 50 }} />

      <Button
        color={COLORS.pink}
        mode="contained"
        style={[styles.btn, { width: '45%', height: 35 }]}
        onPress={() => navigation.goBack()}>
        <Text color="white">تغییر شماره موبایل</Text>
      </Button>

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '28%',
    height: 50,
    borderRadius: 40,
    marginTop: 40,
    marginBottom: 20,
    justifyContent: 'center',
  },
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderBottomWidth: 2,
    marginRight: 10,
    borderColor: '#000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default VerificationScreen;
