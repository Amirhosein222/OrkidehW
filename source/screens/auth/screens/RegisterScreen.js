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
import { sendActivationCode } from '../../../libs/apiCalls';
import { validatePhoneNumber, showSnackbar } from '../../../libs/helpers';

import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../../configs';

import loginBg from '../../../assets/vectors/register/login.png';
import disabledAccept from '../../../assets/icons/btns/disabled-accept.png';
import enabledAccept from '../../../assets/icons/btns/enabled-accept.png';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';

const RegisterScreen = ({ navigation, route }) => {
  const params = route.params;
  const { settings } = useContext(WomanInfoContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [regentCode, setRegentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

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
    if (activeCode.data && activeCode.data.is_successful) {
      setIsLoading(false);
      navigation.navigate('Verification', {
        mobile: phoneNumber,
        regentCode: '',
        isNew: false,
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
      });
    }
    if (register.data && !register.data.is_successful) {
      setIsLoading(false);
      setSnackbar({
        msg: register.data.message.mobile[0],
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
      AsyncStorage.setItem('fullInfo', JSON.stringify(changeNumber.data.data));
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

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.content}>
        <Image
          source={
            settings?.app_image_register_page
              ? { uri: settings.app_image_register_page.value }
              : loginBg
          }
          style={{
            ...styles.image,
          }}
        />
        <Text large color={COLORS.textDark} bold marginTop={rh(3)}>
          {params.editNumber ? 'تغییر شماره تلفن' : 'ورود با شماره تلفن'}
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
        {params.editNumber === false ? (
          <InputRow
            title="کد معرف :"
            placeholder="کد معرف خود را اینجا وارد کنید"
            containerStyle={{ marginTop: rh(0.5), marginBottom: rh(1) }}
            handleTextInput={setRegentCode}
            name="regentCode"
            textStyle={{ width: rw(29) }}
          />
        ) : null}
        <View
          style={{
            width: rw(82),
            marginBottom: rh(4),
            paddingHorizontal: rw(0.1),
          }}>
          <Text
            small
            color={COLORS.textLight}
            textAlign="right"
            marginTop={rh(2)}>
            قبل از تایید شماره تلفنتان از امکان دریافت پیامک به این شماره
            اطمینان حاصل نمایید
          </Text>
        </View>

        <Button
          title={params.editNumber === false ? 'دریافت کد تایید' : 'ویرایش'}
          color={COLORS.primary}
          icons={[disabledAccept, enabledAccept]}
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
