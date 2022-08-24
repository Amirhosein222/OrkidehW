/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Keyboard,
  Image,
  Pressable,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import CountDown from 'react-native-countdown-component';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import authApi from '../../libs/api/authApi';
import {
  saveWomanRelations,
  saveActiveRel,
  WomanInfoContext,
} from '../../libs/context/womanInfoContext';

import {
  Button,
  Text,
  Snackbar,
  BackgroundView,
} from '../../components/common';
import { COLORS, PALETTE, rh, rw, STATUS_BAR_HEIGHT } from '../../configs';

import verifyBg from '../../assets/vectors/register/verify.png';
import back from '../../assets/icons/btns/back.png';
import enableCheck from '../../assets/icons/btns/enabled-check.png';
import disableCheck from '../../assets/icons/btns/disabled-check.png';

const CELL_COUNT = 4;

const VerificationScreen = ({ navigation, route }) => {
  const { settings, saveFullInfo } = useContext(WomanInfoContext);
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
          saveFullInfo(null);
          saveWomanRelations([]);
          saveActiveRel(null);
          await AsyncStorage.setItem(
            'userToken',
            JSON.stringify(response.data.data.token),
          );
          await AsyncStorage.setItem(
            'fullInfo',
            JSON.stringify(response.data.data.user),
          );
          const periodStart = await AsyncStorage.getItem('periodStart');
          periodStart && (await AsyncStorage.removeItem('periodStart'));
          await AsyncStorage.setItem('logedOut', 'false');
          params.isNew
            ? navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'EnterInfo' }],
                }),
              )
            : navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'HomeDrawer' }],
                }),
              );
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
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.content}>
        <Pressable
          disabled={!resendCode ? true : false}
          style={{
            alignSelf: 'flex-start',
            marginTop: rh(3),
          }}
          onPress={navigation.goBack}>
          <Image
            source={back}
            style={{
              width: 25,
              height: 25,
            }}
          />
        </Pressable>

        <Image source={verifyBg} style={styles.image} />
        <View style={{ marginTop: rh(3), width: rw(83) }}>
          <Text large bold color={COLORS.dark}>
            کد تایید
          </Text>
          <Text color={COLORS.textLight} marginTop={rh(3)}>
            کد تایید به شماره {params.mobile} ارسال شده
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
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <View style={styles.counterContainer}>
          {!resendCode && (
            <CountDown
              size={16}
              until={timer}
              onFinish={() => setResendCode(true)}
              digitStyle={{
                backgroundColor: '#FFF',
              }}
              digitTxtStyle={{ color: COLORS.textDark }}
              timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
              separatorStyle={{ color: COLORS.textDark }}
              timeToShow={['M', 'S']}
              timeLabels={{ m: null, s: null }}
              showSeparator
            />
          )}

          <Pressable
            disabled={!resendCode ? true : false}
            style={{ marginTop: resendCode ? rh(1) : 0 }}
            onPress={() => onPressSendCode()}>
            <Text color={resendCode ? COLORS.borderLinkBtn : COLORS.textLight}>
              ارسال مجدد کد
            </Text>
          </Pressable>
        </View>
        <Button
          icons={[disableCheck, enableCheck]}
          title="تایید کد"
          name="check"
          color={COLORS.primary}
          loading={checkingCode ? true : false}
          disabled={checkingCode ? true : false}
          onPress={() => onPressCheckCode()}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
        />
      </View>

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
  content: {
    flex: 1,
    width: rw(83),
    marginTop: STATUS_BAR_HEIGHT,
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 220,
    marginTop: 'auto',
    marginBottom: rh(1),
  },
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginTop: rh(3) },
  cell: {
    width: rw(10),
    height: rh(5),
    lineHeight: 38,
    fontSize: 24,
    backgroundColor: PALETTE.snow,
    borderRadius: 6,
    marginRight: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.textLight,
  },
  focusCell: {
    borderColor: '#000',
  },
  counterContainer: {
    marginTop: rh(2),
    marginBottom: rh(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default VerificationScreen;
