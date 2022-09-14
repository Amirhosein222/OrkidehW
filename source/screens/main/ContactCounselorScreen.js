/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StatusBar, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormData from 'form-data';

import getLoginClient from '../../libs/api/loginClientApi';
import { validatePhoneNumber, showSnackbar } from '../../libs/helpers';

import {
  Text,
  Button,
  TextInput,
  ScreenHeader,
  Snackbar,
  BackgroundView,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { WIDTH, COLORS, SCROLL_VIEW_CONTAINER, rh, rw } from '../../configs';

import SendIcon from '../../assets/icons/btns/enabled-send.svg';

const ContactCounselorScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();

  const [title, setTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text, name) {
    switch (name) {
      case 'phoneNumber':
        setPhoneNumber(text);
        break;
      case 'title':
        setTitle(text);
        break;
      case 'message':
        setMessage(text);
        break;
      default:
        break;
    }
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const verifyInfo = function () {
    if (!title || !phoneNumber || !message) {
      setSnackbar({
        msg: 'لطفا موضوع، شماره تماس و متن پیام خود را وارد کنید.',
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

  const sendMessageToCounselor = async function () {
    if (verifyInfo()) {
      Keyboard.dismiss();
      const loginClient = await getLoginClient();
      setIsSending(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('message', message);
      formData.append('mobile', phoneNumber);
      formData.append('gender', 'woman');
      loginClient.post('call/to/admin', formData).then((response) => {
        setIsSending(false);
        if (response.data.is_successful) {
          showSnackbar('پیام شما با موفقیت ارسال شد.', 'success');
          navigation.navigate('HomeDrawer');
        } else {
          setSnackbar({
            msg: response.data.message,
            visible: true,
          });
        }
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: '#ffffff' }}
      contentContainerStyle={{ backgroundColor: '#ffffff', flex: 1 }}>
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ScreenHeader title="تماس با کارشناس" />
        <ScrollView
          style={{ flex: 1, width: '100%', marginTop: rh(4) }}
          contentContainerStyle={{ ...SCROLL_VIEW_CONTAINER, flex: 1 }}>
          <Text
            marginTop="20"
            marginBottom={rh(1)}
            medium
            bold
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.textDark}>
            موضوع
          </Text>
          <TextInput
            style={{
              ...styles.input,
              backgroundColor: COLORS.inputTabBarBg,
            }}
            onChangeText={handleTextInput}
            inputName="title"
          />
          <Text
            marginTop={rh(4)}
            marginBottom={rh(1)}
            medium
            bold
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.textDark}>
            شماره تماس
          </Text>
          <TextInput
            style={{
              ...styles.input,
              backgroundColor: COLORS.inputTabBarBg,
            }}
            keyboardType="numeric"
            onChangeText={handleTextInput}
            inputName="phoneNumber"
          />
          <Text
            marginTop={rh(4)}
            marginBottom={rh(1)}
            medium
            bold
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.textDark}>
            متن پیام
          </Text>
          <TextInput
            style={{
              ...styles.input,
              backgroundColor: COLORS.inputTabBarBg,
            }}
            multiline={true}
            lineNums={10}
            onChangeText={handleTextInput}
            inputName="message"
          />
          <Button
            title="ارسال"
            Icon={() => (
              <SendIcon
                style={{
                  width: 25,
                  height: 25,
                  marginTop: rh(0.5),
                  marginLeft: rw(1),
                }}
              />
            )}
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
            loading={isSending ? true : false}
            disabled={isSending ? true : false}
            onPress={() => sendMessageToCounselor()}
            style={{ marginTop: 'auto', marginBottom: rh(4) }}
          />
        </ScrollView>

        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            visible={snackbar.visible}
            handleVisible={handleVisible}
          />
        ) : null}
      </BackgroundView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: 250,
  },
  switchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  input: {
    width: rw(82),
    marginTop: 0,
    color: COLORS.textLight,
  },
  btn: {
    width: '40%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
  },
});

export default ContactCounselorScreen;
