/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import authApi from '../../libs/api/authApi';
import getLoginClient from '../../libs/api/loginClientApi';
import { validatePhoneNumber, showSnackbar } from '../../libs/helpers';

import {
  Container,
  Text,
  TextInput,
  Image,
  Snackbar,
} from '../../components/common';
import { COLORS } from '../../configs';

const RegisterScreen = ({ navigation, route }) => {
  const params = route.params;
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
      loginClient.post('change/mobile', formData).then((response) => {
        setIsSendingEdit(false);
        if (response.data.is_successful) {
          showSnackbar('شماره موبایل شما با موفقیت تغییر یافت', 'success');
          AsyncStorage.setItem(
            'userToken',
            JSON.stringify(response.data.data.token),
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeDrawer' }],
            }),
          );
        } else {
          setSnackbar({
            msg: response.data.message.mobile[0],
            visible: true,
          });
        }
      });
    }
  };

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" />
      <Text dark large color="#fe0294">
        شماره موبایل
      </Text>
      <TextInput
        placeholder="شماره تماس خود را وارد کنید"
        textColor={COLORS.pink}
        phColor={COLORS.pink}
        style={styles.input}
        keyboardType="numeric"
        testID="pinput"
        onChangeText={handleTextInput}
        inputName="phoneNumber"
      />

      {params.editNumber === false ? (
        <TextInput
          placeholder="کد معرف خود را وارد کنید"
          style={styles.input}
          textColor={COLORS.pink}
          phColor={COLORS.pink}
          keyboardType="numeric"
          testID="iinput"
          onChangeText={handleTextInput}
          inputName="regentCode"
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
        imageSource={require('../../assets/images/loginImg.png')}
        width="80%"
        height="40%"
        borderRadius="20px"
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
});

export default RegisterScreen;
