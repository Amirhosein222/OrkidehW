/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import {
  saveWomanRelations,
  saveActiveRel,
  WomanInfoContext,
} from '../../../libs/context/womanInfoContext';

import {
  Button,
  Text,
  Snackbar,
  BackgroundView,
} from '../../../components/common';

import { useApi } from '../../../libs/hooks';
import { checkCodeApi, sendCodeApi } from '../apis';
import { COLORS, PALETTE, rh, rw, STATUS_BAR_HEIGHT } from '../../../configs';

import verifyBg from '../../../assets/vectors/register/verify.png';
import back from '../../../assets/icons/btns/back.png';
import enableCheck from '../../../assets/icons/btns/enabled-check.png';
import disableCheck from '../../../assets/icons/btns/disabled-check.png';

const CELL_COUNT = 4;

const VerificationScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const { saveFullInfo, settings } = useContext(WomanInfoContext);

  const [code, setCode] = useState('');
  const [resendCode, setResendCode] = useState(false);
  const [timer, setTimer] = useState(60);
  const ref = useBlurOnFulfill({ code, cellCount: CELL_COUNT });
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    code,
    setCode,
  });
  const [checkCode, setCheckCode] = useApi(() =>
    checkCodeApi(params.mobile, code),
  );
  const [sendCode, setSendCode] = useApi(() => sendCodeApi(params.mobile));

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
    setCheckCode();
  };

  const onPressSendCode = function () {
    setSendCode();
  };

  useEffect(() => {
    if (checkCode.data && checkCode.data.is_successful) {
      console.log('checkCode.data.data.user ', checkCode.data.data.user.mobile);
      saveFullInfo(null);
      saveWomanRelations([]);
      saveActiveRel(null);
      AsyncStorage.setItem('mobile', checkCode.data.data.user.mobile);
      AsyncStorage.setItem(
        'userToken',
        JSON.stringify(checkCode.data.data.token),
      );
      AsyncStorage.setItem(
        'fullInfo',
        JSON.stringify(checkCode.data.data.user),
      );
      const periodStart = AsyncStorage.getItem('periodStart');
      periodStart && AsyncStorage.removeItem('periodStart');
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
    }
    checkCode.data &&
      !checkCode.data.is_successful &&
      setSnackbar({
        msg: checkCode.data.message,
        visible: true,
      });
  }, [checkCode]);

  useEffect(() => {
    if (sendCode.data && sendCode.data.is_successful) {
      setSnackbar({
        msg: sendCode.data.data,
        visible: true,
      });
      setCode('');
      setResendCode(!resendCode);
      setTimer(60 * 2);
    }
    sendCode.data &&
      !sendCode.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [sendCode]);

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
          loading={checkCode.isFetching ? true : false}
          disabled={checkCode.isFetching ? true : false}
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
