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
import {
  COLORS,
  ICON_SIZE,
  PALETTE,
  rh,
  rw,
  STATUS_BAR_HEIGHT,
} from '../../../configs';

import verifyBg from '../../../assets/vectors/register/verify.png';
import back from '../../../assets/icons/btns/back.png';
import EnableCheck from '../../../assets/icons/btns/enabled-check.svg';
import { ActivityIndicator } from 'react-native-paper';

const CELL_COUNT = 5;

const VerificationScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const { saveFullInfo, settings } = useContext(WomanInfoContext);

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [resendCode, setResendCode] = useState(false);
  const [timer, setTimer] = useState(60);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [checkCode, setCheckCode] = useApi(() =>
    checkCodeApi(params.mobile, value),
  );
  const [sendCode, setSendCode] = useApi(() => sendCodeApi(params.mobile));

  const validateInput = function () {
    if (value.length !== 5) {
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
    setSnackbar({
      msg: `کد تایید: ${params.code || ''}`,
      visible: true,
      type: 'success',
      delay: 3000,
    });
  }, []);

  useEffect(() => {
    if (checkCode.data && checkCode.data.is_successful) {
      saveFullInfo(null);
      saveWomanRelations([]);
      saveActiveRel(null);
      AsyncStorage.setItem('mobile', checkCode.data.data.user.mobile);
      AsyncStorage.setItem(
        'userToken',
        JSON.stringify(checkCode.data.data.token),
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
        : params.resetPassword
        ? navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'SetPassword',
                  params: { info: checkCode.data.data.user },
                },
              ],
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
        msg: ` کد تایید: ${sendCode.data.data.user.activation_code}`,
        visible: true,
        type: 'success',
      });
      setValue('');
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

        <Image
          source={
            settings?.app_image_verification_code_page
              ? { uri: settings.app_image_verification_code_page.value }
              : verifyBg
          }
          style={styles.image}
        />
        <View style={{ marginTop: rh(3), width: rw(83) }}>
          <Text size={16} bold color={COLORS.dark}>
            کد تایید
          </Text>
          <Text size={10} color={COLORS.textLight} marginTop={rh(3)}>
            کد تایید به شماره :
            <Text bold color={COLORS.textDark}>
              {' '}
              {params.mobile}
            </Text>{' '}
            ارسال شده
          </Text>
        </View>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
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
              timeLabelStyle={{
                color: 'red',
                fontFamily: 'IRANYekanMobileBold',
              }}
              separatorStyle={{ color: COLORS.textDark }}
              timeToShow={['M', 'S']}
              timeLabels={{ m: null, s: null }}
              showSeparator
              style={{ marginTop: rh(2) }}
            />
          )}

          <Pressable
            disabled={!resendCode || sendCode.isFetching ? true : false}
            style={{ marginTop: rh(2) }}
            onPress={() => onPressSendCode()}>
            {sendCode.isFetching ? (
              <ActivityIndicator size="small" color={COLORS.borderLinkBtn} />
            ) : (
              <Text
                color={resendCode ? COLORS.borderLinkBtn : COLORS.textLight}>
                ارسال مجدد کد
              </Text>
            )}
          </Pressable>
        </View>
        <Button
          Icon={() => <EnableCheck style={ICON_SIZE} />}
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
          delay={snackbar.delay}
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
