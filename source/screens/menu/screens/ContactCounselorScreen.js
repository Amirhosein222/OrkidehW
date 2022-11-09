/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormData from 'form-data';

import getLoginClient from '../../../libs/api/loginClientApi';
import { validateEmail } from '../../../libs/helpers';

import {
  Text,
  Button,
  TextInput,
  ScreenHeader,
  Snackbar,
  BackgroundView,
  InputRow,
} from '../../../components/common';
import { CounselorResponseModal } from '../components';

import { useIsPeriodDay } from '../../../libs/hooks';
import { WIDTH, COLORS, SCROLL_VIEW_CONTAINER, rh, rw } from '../../../configs';

import SendIcon from '../../../assets/icons/btns/enabled-send.svg';

const ContactCounselorScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();

  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text, name) {
    switch (name) {
      case 'email':
        setEmail(text);
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
    if (!title || !email || !message) {
      setSnackbar({
        msg: 'لطفا ایمیل، عنوان و متن پیام خود را وارد کنید',
        visible: true,
      });
      return false;
    }
    if (!validateEmail(email)) {
      setSnackbar({
        msg: 'فرمت ایمیل وارد شده معتبر نیست',
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
      formData.append('email', email);
      formData.append('gender', 'woman');
      console.log('call to admin ', formData);
      loginClient.post('call/to/admin', formData).then(response => {
        setEmail('');
        setMessage('');
        setTitle('');
        setIsSending(false);
        if (response.data.is_successful) {
          setShowModal(true);
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
        <ScreenHeader title="ارتباط با کارشناس" />
        <ScrollView
          style={{ flex: 1, width: '100%', marginTop: rh(4) }}
          contentContainerStyle={{ ...SCROLL_VIEW_CONTAINER, flex: 1 }}>
          <InputRow
            title="ایمیل :"
            placeholder="ایمیل خود را اینجا وارد کنید"
            containerStyle={{ marginTop: rh(4) }}
            inputStyle={{ width: rw(66) }}
            kType="email-address"
            handleTextInput={setEmail}
            name="email"
            tipText="فرمت ایمیل وارد شده صحیح است"
            textStyle={{ width: rw(15) }}
            editedText={email}
          />
          <InputRow
            title="عنوان :"
            placeholder="عنوان پیام خود را اینجا وارد کنید"
            containerStyle={{ marginTop: rh(2) }}
            inputStyle={{ width: rw(66) }}
            handleTextInput={setTitle}
            name="title"
            textStyle={{ width: rw(15) }}
            editedText={title}
          />
          <View>
            <Text
              marginTop={rh(4)}
              marginBottom={rh(1)}
              alignSelf="flex-end"
              medium
              bold
              color={COLORS.textLight}>
              متن پیام :
            </Text>
            <TextInput
              placeholder="متن پیام خود را اینجا وارد کنید"
              phColor={COLORS.textLight}
              style={{
                ...styles.input,
                backgroundColor: COLORS.inputTabBarBg,
              }}
              multiline={true}
              lineNums={10}
              onChangeText={handleTextInput}
              inputName="message"
              editedText={message}
            />
          </View>
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
        {showModal ? (
          <CounselorResponseModal
            visible={showModal}
            closeModal={() => setShowModal(false)}
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
    width: rw(80),
    height: rh(40),
    marginTop: 0,
    borderRadius: 3,
    color: COLORS.textLight,
    textAlignVertical: 'top',
  },
  btn: {
    width: '40%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
  },
});

export default ContactCounselorScreen;
