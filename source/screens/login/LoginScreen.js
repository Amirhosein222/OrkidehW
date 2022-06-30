/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { CommonActions } from '@react-navigation/native';

import authApi from '../../libs/api/authApi';
import { validatePhoneNumber } from '../../libs/helpers';

import {
  Container,
  Text,
  TextInput,
  Image,
  Snackbar,
} from '../../components/common';
import { COLORS } from '../../configs';

const LoginScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text, name) {
    if (name === 'phoneNumber') {
      setPhoneNumber(text);
    } else {
      setPassword(text);
    }
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const validateInput = function (finger = false) {
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
    if (finger === false && !password) {
      setSnackbar({
        msg: 'لطفا رمز عبور خود را وارد کنید.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const onPressLogin = async function () {
    if (validateInput()) {
      setIsSending(true);
      const formData = new FormData();
      formData.append('mobile', phoneNumber);
      formData.append('password', password);
      formData.append('gender', 'woman');
      authApi.post('login', formData).then((response) => {
        setIsSending(false);
        if (response.data.is_successful) {
          AsyncStorage.setItem(
            'userToken',
            JSON.stringify(response.data.data.token),
          );
          AsyncStorage.setItem(
            'fullInfo',
            JSON.stringify(response.data.data.user),
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeDrawer' }],
            }),
          );
        } else {
          if (response.data.message === false) {
            setSnackbar({
              msg: 'رمز عبور اشتباه است',
              visible: true,
            });
          } else {
            setSnackbar({
              msg: response.data.message,
              visible: true,
            });
          }
        }
      });
    }
  };
  const getMessage = function () {
    if (biometryType === 'Face ID') {
      return 'Scan your Face on the device to continue';
    } else {
      return 'انگشت خود را بر روی حسگر اثر انگشت گوشی خود قرار دهید.';
    }
  };

  const showAuthenticationDialog = function () {
    if (validateInput(true)) {
      if (biometryType !== null && biometryType !== undefined) {
        FingerprintScanner.authenticate({
          description: getMessage(),
        })
          .then(() => {
            onPressLogin();
          })
          .catch((error) => {
            console.log('Authentication error is => ', error);
          });
      } else {
        console.log('biometric authentication is not available');
      }
    }
  };

  useEffect(() => {
    FingerprintScanner.isSensorAvailable()
      .then((bioType) => {
        setBiometryType(bioType);
      })
      .catch((error) =>
        setSnackbar({
          msg: 'دستگاه شما از قابلیت اثر انگشت برخوردار نمی باشد.',
          visible: true,
        }),
      );
  }, []);

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" />
      <Text medium color="#fe0294">
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

      <Text medium color="#fe0294">
        رمز عبور
      </Text>
      <TextInput
        placeholder="رمز عبور خود را وارد کنید"
        phColor={COLORS.pink}
        textColor={COLORS.pink}
        style={styles.input}
        testID="pinput"
        onChangeText={handleTextInput}
        inputName="password"
      />

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}>
        <Button
          color={COLORS.pink}
          mode="contained"
          style={styles.btn}
          testID="loginBtn"
          loading={isSending ? true : false}
          disabled={isSending ? true : false}
          onPress={() => onPressLogin()}>
          <Text color="white">ورود کاربر</Text>
        </Button>
        <Button
          color={COLORS.pink}
          mode="contained"
          style={[styles.btn, { width: '40%' }]}
          testID="loginBtn"
          onPress={() => showAuthenticationDialog()}>
          <Text color="white" small>
            ورود با اثر انگشت
          </Text>
        </Button>
      </View>

      <Button
        color={COLORS.pink}
        mode="outlined"
        style={{ width: '50%', borderRadius: 40, marginBottom: 5 }}
        testID="loginBtn"
        onPress={() => navigation.navigate('Register')}>
        <Text color={COLORS.pink}>ایجاد حساب کاربری</Text>
      </Button>
      <Image
        imageSource={require('../../assets/images/period+date.jpg')}
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
    height: 40,
    borderRadius: 40,
    margin: 10,
    justifyContent: 'center',
  },
  input: {
    width: '75%',
    margin: 10,
  },
  snackbar: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
});

export default LoginScreen;
