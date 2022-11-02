/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, StyleSheet, Image, Pressable } from 'react-native';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { CommonActions } from '@react-navigation/native';

import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import authApi from '../../../libs/api/authApi';
import { useApi } from '../../../libs/hooks';
import { getSettings } from '../../../libs/apiCalls';
import {
  getFromAsyncStorage,
  validatePhoneNumber,
} from '../../../libs/helpers';

import {
  Text,
  TextInput,
  Snackbar,
  BackgroundView,
  Button,
} from '../../../components/common';
import { COLORS, rh, rw } from '../../../configs';

const LoginScreen = ({ navigation, route }) => {
  const { saveSettings } = useContext(WomanInfoContext);
  const [settings, setSettings] = useApi(() => getSettings(''));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [loginSettings, setLoginSettings] = useState(null);
  const [hasToken, setHasToken] = useState(null);
  const [isFingerActive, setIsFingerActive] = useState(false);

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

  const onPressLogin = async function (isBiometric = false) {
    if (validateInput()) {
      setIsSending(true);
      const formData = new FormData();
      formData.append('mobile', phoneNumber);
      formData.append('gender', 'woman');
      isBiometric
        ? formData.append('isBiometric', true)
        : formData.append('password', password);
      authApi.post('login', formData).then(async response => {
        setIsSending(false);
        if (response.data.is_successful) {
          await AsyncStorage.setItem('logedOut', 'false');
          await AsyncStorage.setItem(
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
      return 'حسگر اثر انگشت را لمس کنید';
    }
  };

  const showAuthenticationDialog = function () {
    if (!hasToken) {
      setSnackbar({
        msg: 'لطفا ابتدا با رمز عبور وارد شوید',
        visible: true,
      });
      return false;
    }
    if (!isFingerActive) {
      return setSnackbar({
        msg: 'ورود با اثر انگشت برای شما فعال نیست',
        visible: true,
      });
    }
    if (biometryType !== null && biometryType !== undefined) {
      FingerprintScanner.authenticate({
        description: getMessage(),
      })
        .then(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeDrawer' }],
            }),
          );
          FingerprintScanner.release();
        })
        .catch(error => {
          FingerprintScanner.release();
          // console.log('Authentication error is => ', error);
        });
    } else {
      console.log('biometric authentication is not available');
    }
  };

  useEffect(() => {
    setSettings();
    FingerprintScanner.isSensorAvailable()
      .then(bioType => {
        setBiometryType(bioType);
      })
      .catch(error =>
        setSnackbar({
          msg: 'دستگاه شما از قابلیت اسکن اثر انگشت برخوردار نمی باشد.',
          visible: true,
        }),
      );
    getFromAsyncStorage('userToken').then(res => {
      if (res) {
        setHasToken(true);
      }
    });
    getFromAsyncStorage('mobile').then(res => {
      if (res) {
        setPhoneNumber(res);
      }
    });
    getFromAsyncStorage('isFingerActive').then(res => {
      if (res) {
        setIsFingerActive(true);
      }
    });
  }, []);

  useEffect(() => {
    if (settings.data && settings.data.is_successful) {
      const result = settings.data.data.find(
        e => e.key === 'app_image_login_page',
      );
      result && setLoginSettings(result);
      const settingsObj = settings.data.data.reduce(
        (acc, cur) => ({ ...acc, [cur.key]: cur }),
        {},
      );
      saveSettings(settingsObj);
    }
  }, [settings]);

  useEffect(() => {
    return () => {
      FingerprintScanner.release();
    };
  }, []);
  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.content}>
        <Image
          source={{ uri: loginSettings && loginSettings.value }}
          style={{ ...styles.image, backgroundColor: 'rgba(200,200,200, 0.6)' }}
        />
        <TextInput
          placeholder="لطفا شماره موبایل خود را اینجا وارد کنید."
          textColor={COLORS.textLight}
          phColor={COLORS.textLight}
          style={{ ...styles.input, marginTop: rh(6) }}
          editedText={phoneNumber}
          keyboardType="numeric"
          testID="pinput"
          onChangeText={handleTextInput}
          inputName="phoneNumber"
          fontWeight="bold"
        />

        <TextInput
          placeholder="لطفا رمز عبور خود را اینجا وارد کنید."
          textColor={COLORS.textLight}
          phColor={COLORS.textLight}
          style={styles.input}
          testID="pinput"
          onChangeText={handleTextInput}
          inputName="password"
          fontWeight="bold"
        />
        <Pressable
          onPress={() =>
            navigation.navigate('Register', { resetPassword: true })
          }
          style={{ width: rw(80) }}>
          <Text
            size={10}
            color={COLORS.borderLinkBtn}
            alignSelf="flex-end"
            marginRight={rw(2)}>
            رمز عبور خود را فراموش کرده ام
          </Text>
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            width: rw(75),
            justifyContent: 'space-between',
            marginTop: rh(4),
            marginBottom: rh(2),
          }}>
          <Button
            title="ورود کاربر"
            color={COLORS.primary}
            style={{ width: rw(35) }}
            loading={isSending ? true : false}
            disabled={isSending ? true : false}
            onPress={() => onPressLogin()}
          />
          <Button
            title="ورود با اثر انگشت"
            color={COLORS.primary}
            style={{ width: rw(35) }}
            onPress={() => showAuthenticationDialog()}
          />
        </View>

        <Button
          title="ایجاد حساب کاربری"
          color={COLORS.primary}
          style={{ width: rw(75), marginBottom: rh(0) }}
          disabled={!settings.data ? true : false}
          onPress={() =>
            navigation.navigate('Register', { resetPassword: false })
          }
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    marginTop: rh(0),
    flex: 1,
  },
  btn: {
    height: 40,
    borderRadius: 40,
    margin: 10,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: COLORS.inputTabBarBg,
    width: '75%',
    margin: 10,
  },
  image: {
    width: rw(73),
    height: rh(35),
    borderRadius: 15,
  },
  snackbar: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
});

export default LoginScreen;
