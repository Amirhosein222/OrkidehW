/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import {
  BackgroundView,
  Text,
  Snackbar,
  InputRow,
  Button,
} from '../../../components/common';

import { registerApi, changeNumberApi } from '../apis';
import { useApi } from '../../../libs/hooks';
import { getSettings, sendActivationCode } from '../../../libs/apiCalls';
import { validatePhoneNumber } from '../../../libs/helpers';

import { COLORS, ICON_SIZE, rh, rw, STATUS_BAR_HEIGHT } from '../../../configs';

import loginBg from '../../../assets/vectors/register/login.png';
import EnabledAccept from '../../../assets/icons/btns/enabled-accept.svg';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';

const RegisterScreen = ({ navigation, route }) => {
  const params = route.params;
  const { saveSettings } = useContext(WomanInfoContext);
  const [settings, setSettings] = useApi(() => getSettings(''));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [regentCode, setRegentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [registerSettings, setRegisterSettings] = useState(null);

  const [activeCode, setActiveCode] = useApi(() =>
    sendActivationCode(phoneNumber),
  );
  const [register, setRegister] = useApi(() =>
    registerApi(phoneNumber, regentCode),
  );
  const [changeNumber, setChangeNumber] = useApi(() =>
    changeNumberApi(phoneNumber),
  );

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const validateInput = function () {
    if (phoneNumber.length !== 11) {
      setSnackbar({
        msg: 'شماره موبایل صحیح نیست!',
        visible: true,
      });
      return false;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setSnackbar({
        msg: 'فرمت تلفن همراه معتبر نیست.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const onRegister = () => {
    if (validateInput()) {
      setIsLoading(true);
      setRegister();
    }
  };

  const onLogin = function () {
    if (validateInput()) {
      setIsLoading(true);
      setActiveCode();
    }
  };

  const onChangeNumber = async function () {
    if (validateInput()) {
      setChangeNumber();
    }
  };

  useEffect(() => {
    setSettings();
  }, []);

  useEffect(() => {
    if (activeCode.data && activeCode.data.is_successful) {
      setIsLoading(false);
      navigation.navigate('Verification', {
        mobile: phoneNumber,
        regentCode: '',
        isNew: false,
        resetPassword: params.resetPassword,
        code: activeCode.data.data.user.activation_code,
      });
    }
    if (activeCode.data && !activeCode.data.is_successful) {
      setIsLoading(false);

      onRegister();
    }
  }, [activeCode]);

  useEffect(() => {
    if (register.data && register.data.is_successful) {
      setIsLoading(false);
      navigation.navigate('Verification', {
        mobile: register.data.data.mobile,
        regentCode: register.data.data.regent_code,
        isNew: true,
        resetPassword: params.resetPassword,
        code: register.data.data.activation_code,
      });
    }
    if (register.data && !register.data.is_successful) {
      setIsLoading(false);
      setSnackbar({
        msg: JSON.stringify(register.data.message),
        visible: true,
      });
    }
  }, [register]);

  useEffect(() => {
    if (changeNumber.data && changeNumber.data.is_successful) {
      setSnackbar({
        msg: 'شماره موبایل شما با موفقیت تغییر یافت',
        visible: true,
        type: 'success',
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeDrawer' }],
        }),
      );
    }
    if (changeNumber.data && !changeNumber.data.is_successful) {
      setSnackbar({
        msg: changeNumber.data.message.hasOwnProperty('mobile')
          ? changeNumber.data.message.mobile
          : changeNumber.data.message,
        visible: true,
      });
    }
  }, [changeNumber]);

  useEffect(() => {
    if (settings.data && settings.data.is_successful) {
      const result = settings.data.data.find(
        e => e.key === 'app_image_register_page',
      );
      result && setRegisterSettings(result);
      const settingsObj = settings.data.data.reduce(
        (acc, cur) => ({ ...acc, [cur.key]: cur }),
        {},
      );
      saveSettings(settingsObj);
    }
  }, [settings]);

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.content}>
        <Image
          source={registerSettings ? { uri: registerSettings.value } : loginBg}
          style={{
            ...styles.image,
          }}
        />
        <Text size={16} color={COLORS.textDark} bold marginTop={rh(3)}>
          {params.editNumber
            ? 'تغییر شماره تلفن'
            : params.resetPassword
            ? 'فراموشی رمز عبور'
            : 'ورود با شماره تلفن'}
        </Text>
        <InputRow
          title="شماره موبایل :"
          placeholder="شماره موبایل خود را اینجا وارد کنید"
          containerStyle={{ marginTop: rh(4) }}
          kType="numeric"
          handleTextInput={setPhoneNumber}
          name="phoneNumber"
          tipText="فرمت شماره وارد شده صحیح است"
          textStyle={{ width: rw(29) }}
        />
        {!params.editNumber && !params.resetPassword ? (
          <InputRow
            title="کد معرف :"
            placeholder="کد معرف خود را اینجا وارد کنید"
            containerStyle={{ marginTop: rh(0.5), marginBottom: rh(1) }}
            handleTextInput={setRegentCode}
            name="regentCode"
            textStyle={{ width: rw(29) }}
          />
        ) : null}
        {!params.resetPassword ? (
          <View
            style={{
              width: rw(82),
              marginBottom: rh(4),
              paddingHorizontal: rw(0.1),
            }}>
            <Text
              size={10}
              color={COLORS.textLight}
              textAlign="right"
              marginTop={rh(2)}>
              قبل از تایید شماره تلفنتان از امکان دریافت پیامک به این شماره
              اطمینان حاصل نمایید
            </Text>
          </View>
        ) : null}

        <Button
          title={params.editNumber === false ? 'دریافت کد تایید' : 'ویرایش'}
          color={COLORS.primary}
          Icon={() => (
            <EnabledAccept style={{ ...ICON_SIZE, marginTop: rh(0.5) }} />
          )}
          loading={
            params.editNumber
              ? changeNumber.isFetching
                ? true
                : false
              : isLoading
              ? true
              : false
          }
          disabled={
            params.editNumber
              ? changeNumber.isFetching
                ? true
                : false
              : isLoading
              ? true
              : false
          }
          onPress={params.editNumber ? onChangeNumber : onLogin}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
        />

        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </View>
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
  snackbar: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  image: {
    width: 220,
    height: 220,
    marginTop: 'auto',
    marginBottom: rh(1),
  },
});

export default RegisterScreen;
