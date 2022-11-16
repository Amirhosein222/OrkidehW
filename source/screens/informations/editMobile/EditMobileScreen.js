/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { View, StatusBar, StyleSheet, Image } from 'react-native';
import FormData from 'form-data';

import {
  Text,
  Snackbar,
  InputRow,
  Button,
  ScreenHeader,
  BackgroundView,
} from '../../../components/common';

import getLoginClient from '../../../libs/api/loginClientApi';
import { validatePhoneNumber } from '../../../libs/helpers';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';

import { COLORS, rh, rw } from '../../../configs';
import loginBg from '../../../assets/images/login_bg.png';

import enabledEdit from '../../../assets/icons/btns/enabled-edit.png';
import disabledEdit from '../../../assets/icons/btns/disabled-edit.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditMobileScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const { settings, saveFullInfo } = useContext(WomanInfoContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

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

  const onPressEdit = async function () {
    if (validateInput()) {
      setIsLoading(true);
      const loginClient = await getLoginClient();
      const formData = new FormData();
      formData.append('mobile', phoneNumber);
      formData.append('gender', 'woman');
      loginClient.post('change/mobile', formData).then(async response => {
        setIsLoading(false);
        if (response.data.is_successful) {
          AsyncStorage.setItem('mobile', response.data.data.user.mobile);
          AsyncStorage.setItem(
            'userToken',
            JSON.stringify(response.data.data.token),
          );
          setSnackbar({
            msg: 'شماره موبایل شما با موفقیت تغییر یافت',
            visible: true,
            type: 'success',
          });
          saveFullInfo(response.data.data);
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
    <BackgroundView>
      <ScreenHeader title="تغییر شماره تلفن" disableBack={isLoading} />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Image
        source={loginBg}
        style={{
          ...styles.image,
        }}
      />
      <Text large color={COLORS.textDark} bold marginTop={rh(2)}>
        تغییر شماره موبایل
      </Text>
      <InputRow
        title="شماره موبایل جدید :"
        placeholder="شماره موبایل جدید را اینجا وارد کنید"
        containerStyle={{ marginTop: rh(4) }}
        handleTextInput={setPhoneNumber}
        kType="numeric"
        name="newMobile"
        textStyle={{ width: rw(32) }}
      />
      <View style={{ width: rw(84) }}>
        <Text
          small
          color={COLORS.textLight}
          textAlign="right"
          marginTop={rh(1)}>
          قبل از تغییر شماره تلفنتان از امکان دریافت پیامک با شماره جدید اطمینان
          حاصل نمایید
        </Text>
      </View>

      <Button
        title="تغییر شماره"
        icons={[disabledEdit, enabledEdit]}
        color={COLORS.borderLinkBtn}
        loading={isLoading}
        disabled={isLoading}
        onPress={onPressEdit}
        style={{ marginTop: 'auto', marginBottom: rh(4) }}
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
  container: {
    flex: 1,
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

export default EditMobileScreen;
