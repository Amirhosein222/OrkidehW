/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { CommonActions } from '@react-navigation/native';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import authApi from '../../libs/api/authApi';
import { useApi } from '../../libs/hooks';
import { getSettings } from '../../libs/apiCalls';
import { getFromAsyncStorage, validatePhoneNumber } from '../../libs/helpers';

import { Text, TextInput, Snackbar } from '../../components/common';
import { COLORS, rh, rw } from '../../configs';

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
      authApi.post('login', formData).then(async (response) => {
        setIsSending(false);
        if (response.data.is_successful) {
          await AsyncStorage.setItem('logedOut', 'false');
          await AsyncStorage.setItem(
            'userToken',
            JSON.stringify(response.data.data.token),
          );
          await AsyncStorage.setItem(
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
    if (!hasToken) {
      setSnackbar({
        msg: 'لطفا ابتدا با رمز عبور وارد شوید.',
        visible: true,
      });
      return false;
    }
    if (biometryType !== null && biometryType !== undefined) {
      FingerprintScanner.authenticate({
        description: getMessage(),
      })
        .then(() => {
          AsyncStorage.setItem('logedOut', 'false');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeDrawer' }],
            }),
          );
        })
        .catch((error) => {
          console.log('Authentication error is => ', error);
        });
    } else {
      console.log('biometric authentication is not available');
    }
  };

  useEffect(() => {
    setSettings();
    FingerprintScanner.isSensorAvailable()
      .then((bioType) => {
        setBiometryType(bioType);
      })
      .catch((error) =>
        setSnackbar({
          msg: 'دستگاه شما از قابلیت اسکن اثر انگشت برخوردار نمی باشد.',
          visible: true,
        }),
      );
    getFromAsyncStorage('userToken').then((res) => {
      if (res) {
        setHasToken(true);
      }
    });
  }, []);

  useEffect(() => {
    if (settings.data && settings.data.is_successful) {
      const result = settings.data.data.find(
        (e) => e.key === 'app_image_login_page',
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
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.content}>
        <Text large color="#fe0294">
          سلام عزیزم! به نرم افزار ارکیده خوش اومدی.
        </Text>
        {/* <Text medium color="#fe0294" marginTop={rh(5)}>
          شماره موبایل
        </Text> */}
        <TextInput
          placeholder="لطفا شماره موبایلت رو اینجا وارد کن."
          textColor={COLORS.white}
          phColor={COLORS.white}
          style={{ ...styles.input, marginTop: rh(8) }}
          keyboardType="numeric"
          testID="pinput"
          onChangeText={handleTextInput}
          inputName="phoneNumber"
          fontWeight="bold"
        />

        {/* <Text medium color="#fe0294">
          رمز عبور
        </Text> */}
        <TextInput
          placeholder="لطفا رمز عبورت رو اینجا وارد کن."
          textColor={COLORS.white}
          phColor={COLORS.white}
          style={styles.input}
          testID="pinput"
          onChangeText={handleTextInput}
          inputName="password"
          fontWeight="bold"
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
          style={{ width: '50%', borderRadius: 40, marginTop: rh(1) }}
          testID="loginBtn"
          disabled={!settings.data ? true : false}
          onPress={() => navigation.navigate('Register')}>
          <Text color={COLORS.pink}>ایجاد حساب کاربری</Text>
        </Button>
      </View>

      <Image
        source={{ uri: loginSettings && loginSettings.value }}
        style={{ ...styles.image, backgroundColor: 'rgba(200,200,200, 0.6)' }}
      />

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </View>
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
    marginTop: rh(2),
  },
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
  image: {
    width: rw(73),
    height: rh(35),
    borderRadius: 15,
    marginTop: rh(8),
  },
  snackbar: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
});

export default LoginScreen;
