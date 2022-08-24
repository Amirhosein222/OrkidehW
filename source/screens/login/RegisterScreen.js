/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import { View, StatusBar, StyleSheet, Image } from 'react-native';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import {
  BackgroundView,
  Text,
  Snackbar,
  InputRow,
  Button,
} from '../../components/common';

import { useApi } from '../../libs/hooks';
import getLoginClient from '../../libs/api/loginClientApi';
import { sendActivationCode } from '../../libs/apiCalls';
import authApi from '../../libs/api/authApi';
import { validatePhoneNumber, showSnackbar } from '../../libs/helpers';

import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../configs';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

import loginBg from '../../assets/vectors/register/login.png';

import disabledAccept from '../../assets/icons/btns/disabled-accept.png';
import enabledAccept from '../../assets/icons/btns/enabled-accept.png';

const RegisterScreen = ({ navigation, route }) => {
  const params = route.params;
  const { settings, saveFullInfo } = useContext(WomanInfoContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [regentCode, setRegentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEdit, setIsSendingEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [activeCode, setActiveCode] = useApi(() =>
    sendActivationCode(phoneNumber),
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
    const formData = new FormData();
    formData.append('mobile', phoneNumber);
    formData.append('gender', 'woman');
    formData.append('regent_code', regentCode);
    authApi
      .post('register/send_activation_code', formData)
      .then((response) => {
        setIsLoading(false);
        if (response.data.is_successful) {
          navigation.navigate('Verification', {
            mobile: response.data.data.mobile,
            regentCode: response.data.data.regent_code,
            isNew: true,
          });
        } else {
          setSnackbar({
            msg: response.data.message.mobile[0],
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

  const handleRegisterLogin = function () {
    if (validateInput()) {
      setIsLoading(true);
      setActiveCode();
    }
  };

  const onPressEdit = async function () {
    if (validateInput()) {
      const loginClient = await getLoginClient();
      setIsSendingEdit(true);
      const formData = new FormData();
      formData.append('mobile', phoneNumber);
      formData.append('gender', 'woman');
      loginClient.post('change/mobile', formData).then(async (response) => {
        setIsSendingEdit(false);
        if (response.data.is_successful) {
          showSnackbar('شماره موبایل شما با موفقیت تغییر یافت', 'success');
          await AsyncStorage.setItem(
            'fullInfo',
            JSON.stringify(response.data.data),
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeDrawer' }],
            }),
          );
        } else {
          setSnackbar({
            msg: response.data.message.hasOwnProperty('mobile')
              ? response.data.message.mobile
              : response.data.message,
            visible: true,
          });
        }
      });
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
      onRegister();
    }
  }, [activeCode]);

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.content}>
        <Image
          source={loginBg}
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
              ? isSendingEdit
                ? true
                : false
              : isLoading
              ? true
              : false
          }
          disabled={
            params.editNumber
              ? isSendingEdit
                ? true
                : false
              : isLoading
              ? true
              : false
          }
          onPress={params.editNumber ? onPressEdit : handleRegisterLogin}
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
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.mainBg,
  },
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
