/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  BackHandler,
  Animated,
} from 'react-native';
import { Button } from 'react-native-paper';
import FormData from 'form-data';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import userDefaultProfile from '../../assets/images/iconfinder_user_female2_172622.png';
const userDefaultProfile =
  'bundle-assets://images/iconfinder_user_female2_172622.png';
const defaultProfileUri = Image.resolveAssetSource(userDefaultProfile);

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Text,
  TextInput,
  Divider,
  Switch,
  Snackbar,
} from '../../components/common';
import { WIDTH, COLORS, rh } from '../../configs';

const SetPassword = ({ goToNextStage, nameAndPic }) => {
  let fullInfo = {};
  const [password, setPassword] = useState('');
  const [repeatPass, setRepeatPass] = useState('');
  const [passwordActive, setPasswordActive] = useState(true);
  const [finger, setFinger] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleTextInput = function (text, type) {
    if (type === 'password') {
      setPassword(text);
    } else {
      setRepeatPass(text);
    }
  };

  const mergeInformations = function () {
    fullInfo = {
      ...nameAndPic,
      password: password,
      repeatPass: repeatPass,
      passwordActive: passwordActive === false ? 1 : 0,
      finger: finger === false ? 1 : 0,
    };
  };
  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  const validate = function () {
    if (passwordActive === true && finger === true) {
      setSnackbar({
        msg: 'فعال کردن حداقل یکی از روش ها الزامی است!',
        visible: true,
      });
      return false;
    }
    if (passwordActive === false && password === '' && repeatPass === '') {
      setSnackbar({
        msg: 'لطفا رمز عبور را وارد کنید.',
        visible: true,
      });
      return false;
    }
    if (password !== repeatPass) {
      setSnackbar({
        msg: 'رمز عبور، با تکرار آن مطابقت ندارد!',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const handeShowPassInput = function (status) {
    if (status === false) {
      setPasswordActive(status);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }).start();
    } else {
      setPasswordActive(status);
      setPassword('');
      setRepeatPass('');
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const completeRegister = async function () {
    const loginClient = await getLoginClient();
    await mergeInformations();
    if (validate()) {
      setIsLoading(true);
      const formData = new FormData();
      if (fullInfo.picture) {
        formData.append('image', {
          uri: fullInfo.picture.path,
          type: `image/${fullInfo.picture.type}`,
          name: 'profileImg.' + fullInfo.picture.type,
        });
      }
      formData.append('display_name', fullInfo.name);
      formData.append('birth_date', fullInfo.birthday);
      formData.append('is_password_active', fullInfo.passwordActive);
      formData.append('is_finger_active', fullInfo.finger);
      formData.append('password', fullInfo.password);
      formData.append('repeat_password', fullInfo.repeatPass);
      formData.append('gender', 'woman');
      console.log('form DATA ', formData);

      loginClient
        .post('complete/profile', formData)
        .then((response) => {
          setIsLoading(false);
          if (response.data.is_successful) {
            AsyncStorage.setItem(
              'fullInfo',
              JSON.stringify(response.data.data),
            );
            goToNextStage(2);
          } else {
            setSnackbar({
              msg: 'متاسفانه مشکلی بوجود آمده است',
              visible: true,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    const backAction = () => {
      goToNextStage(0);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  return (
    <View style={styles.content}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
        <Text medium>رمز عبور برای ورود به سیستم</Text>

        <Switch active={passwordActive} changeStatus={handeShowPassInput} />

        <Animated.View
          style={[
            styles.input,
            { display: !passwordActive ? 'flex' : 'none', opacity: fadeAnim },
          ]}>
          <TextInput
            placeholder="رمز عبور را وارد کنید"
            textColor={COLORS.pink}
            phColor={COLORS.pink}
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={handleTextInput}
            inputName="password"
          />
          <Text small>رمز عبور جدید</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.input,
            { display: !passwordActive ? 'flex' : 'none', opacity: fadeAnim },
          ]}>
          <TextInput
            placeholder="رمز عبور را مجددا وارد کنید"
            textColor={COLORS.pink}
            phColor={COLORS.pink}
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={handleTextInput}
            inputName="repeatPass"
          />
          <Text small>تایید رمز عبور</Text>
        </Animated.View>

        <Divider color={COLORS.pink} width="90%" style={{ marginTop: 20 }} />

        <Text medium>فعالسازی اثر انگشت برای ورود به سیستم</Text>

        <Switch active={finger} changeStatus={setFinger} />
        <Button
          color={COLORS.pink}
          mode="contained"
          style={styles.btn}
          loading={isLoading ? true : false}
          disabled={isLoading ? true : false}
          onPress={() => completeRegister()}>
          <Text color="white">اتمام ثبت نام</Text>
        </Button>
      </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
    justifyContent: 'space-evenly',
  },
  image: {
    width: WIDTH,
    height: 250,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textInput: {
    width: '65%',
    borderRadius: 50,
    height: 45,
    marginRight: 10,
    paddingRight: 10,
  },
  btn: {
    width: '40%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: rh(4),
  },
});

export default SetPassword;
