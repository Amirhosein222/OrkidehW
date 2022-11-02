/* eslint-disable react-native/no-inline-styles */
import { CommonActions } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, BackHandler, StatusBar } from 'react-native';

import {
  BackgroundView,
  ScreenHeader,
  Button,
  TextInput,
  Snackbar,
} from '../../../components/common';
import { COLORS, rh, rw } from '../../../configs';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { useApi } from '../../../libs/hooks';

import { setPasswordApi } from '../../informations/privacy/api';

import verifyBg from '../../../assets/vectors/register/verify.png';

const SetPassword = ({ route, navigation }) => {
  const params = route.params || {};
  const { settings } = useContext(WomanInfoContext);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [pass, setPass] = useState('');
  const disableBack = useRef(false);

  const [submitPassword, setSubmitPassword] = useApi(() =>
    setPasswordApi(params.info, pass),
  );

  const onSubmit = () => {
    if (!pass) {
      return setSnackbar({
        msg: 'لطفا ابتدا رمز عبور جدید را وارد کنید',
        visible: true,
      });
    }
    setSubmitPassword();
  };

  const backAction = () => {
    if (!submitPassword.isFetching && !disableBack.current) {
      navigation.navigate('Login');
      return true;
    }
    return true;
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  useEffect(() => {
    if (submitPassword.data && submitPassword.data.is_successful) {
      disableBack.current = true;
      setSnackbar({
        msg:
          'رمز عبور شما با موفقیت تغییر یافت، لطفا با رمز عبور جدید وارد شود',
        visible: true,
        type: 'success',
      });
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Login',
              },
            ],
          }),
        );
      }, 3000);
    }
    if (submitPassword.data && !submitPassword.data.is_successful) {
      setSnackbar({
        msg: submitPassword.data.message.mobile[0],
        visible: true,
      });
    }
  }, [submitPassword]);

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScreenHeader
        title="رمز عبور جدید"
        customOnPress={() => navigation.navigate('Login')}
        disableBack={submitPassword.isFetching}
      />
      <Image
        source={
          settings.app_image_field_password
            ? { uri: settings.app_image_field_password.value }
            : verifyBg
        }
        style={styles.image}
      />
      <View style={styles.content}>
        <TextInput
          placeholder="لطفا رمز عبور جدید را اینجا وارد کنید."
          textColor={COLORS.textLight}
          phColor={COLORS.textLight}
          style={styles.input}
          testID="pinput"
          onChangeText={setPass}
          inputName="password"
          fontWeight="bold"
        />
      </View>
      <Button
        title="ثبت"
        color={COLORS.primary}
        style={{ width: rw(75), marginBottom: rh(4), marginTop: 'auto' }}
        disabled={submitPassword.isFetching || disableBack.current}
        loading={submitPassword.isFetching}
        onPress={onSubmit}
      />
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
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(82),
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  image: {
    width: rw(73),
    height: rh(35),
    borderRadius: 15,
    marginTop: rh(6),
  },
  input: {
    backgroundColor: COLORS.inputTabBarBg,
    width: rw(74),
    margin: 10,
  },
});

export default SetPassword;
