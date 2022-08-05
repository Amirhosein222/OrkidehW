/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { StatusBar, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import { Container, Text, TextInput, Snackbar } from '../../components/common';

import getLoginClient from '../../libs/api/loginClientApi';
import authApi from '../../libs/api/authApi';
import { validatePhoneNumber, showSnackbar } from '../../libs/helpers';

import { COLORS, rh, rw } from '../../configs';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

const RegisterScreen = ({ navigation, route }) => {
  const params = route.params;
  const { settings, saveFullInfo } = useContext(WomanInfoContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [regentCode, setRegentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEdit, setIsSendingEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text, name) {
    if (name === 'phoneNumber') {
      setPhoneNumber(text);
    } else {
      setRegentCode(text);
    }
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  const validateInput = function () {
    if (phoneNumber.length !== 11) {
      setSnackbar({
        msg: 'شماره تماس صحیح نیست!',
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

  const onPressLogin = function () {
    if (validateInput()) {
      setIsLoading(true);
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

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Text large color="#fe0294">
        {params.editNumber ? 'تغییر شماره تلفن' : 'ایجاد حساب کاربری'}
      </Text>
      <TextInput
        placeholder="لطفا شماره موبایلت رو اینجا وارد کن."
        textColor={COLORS.white}
        phColor={COLORS.white}
        style={{ ...styles.input, marginTop: rh(6) }}
        keyboardType="numeric"
        testID="pinput"
        onChangeText={handleTextInput}
        inputName="phoneNumber"
        fontWeight="bold"
      />

      {params.editNumber === false ? (
        <TextInput
          placeholder="اگه کد معرف داری اینجا بنویس."
          style={styles.input}
          textColor={COLORS.white}
          phColor={COLORS.white}
          keyboardType="numeric"
          testID="iinput"
          onChangeText={handleTextInput}
          inputName="regentCode"
          fontWeight="bold"
        />
      ) : null}

      <Button
        color={COLORS.pink}
        mode="contained"
        style={styles.btn}
        testID="loginBtn"
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
        onPress={
          params.editNumber ? () => onPressEdit() : () => onPressLogin()
        }>
        <Text color="white">
          {params.editNumber === false ? 'ثبت نام' : 'ویرایش'}
        </Text>
      </Button>

      <Image
        source={{ uri: settings && settings.app_image_register_page.value }}
        style={{ ...styles.image, backgroundColor: 'rgba(200,200,200, 0.6)' }}
      />

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
    width: '30%',
    height: 50,
    borderRadius: 40,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  input: {
    width: '75%',
    marginTop: 20,
  },
  snackbar: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  image: {
    width: rw(73),
    height: rh(35),
    borderRadius: 15,
    marginTop: rh(8),
  },
});

export default RegisterScreen;
