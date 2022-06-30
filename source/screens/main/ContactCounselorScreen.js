/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StatusBar, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { Button } from 'react-native-paper';
import FormData from 'form-data';

import getLoginClient from '../../libs/api/loginClientApi';
import { validatePhoneNumber, showSnackbar } from '../../libs/helpers';

import {
  Container,
  Text,
  Divider,
  TextInput,
  TabBar,
  Header,
  Snackbar,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import {
  WIDTH,
  COLORS,
  SCROLL_VIEW_CONTAINER,
  STATUS_BAR_HEIGHT,
} from '../../configs';

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
      formData.append('parent_id', 1);
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
    <Container>
      <StatusBar translucent backgroundColor="transparent" />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + 5, margin: 0 }}
      />
      <ScrollView
        style={{ flex: 1, width: '100%', marginTop: 30 }}
        contentContainerStyle={SCROLL_VIEW_CONTAINER}>
        <Text medium bold color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          تماس با کارشناس
        </Text>
        <Divider color={COLORS.pink} width="85%" style={{ marginTop: 20 }} />
        <Text
          marginTop="20"
          medium
          bold
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          موضوع
        </Text>
        <TextInput
          style={{
            ...styles.input,
            backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
          }}
          onChangeText={handleTextInput}
          inputName="title"
        />
        <Text
          marginTop="20"
          medium
          bold
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          شماره تماس
        </Text>
        <TextInput
          style={{
            ...styles.input,
            backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
          }}
          keyboardType="numeric"
          onChangeText={handleTextInput}
          inputName="phoneNumber"
        />
        <Text
          marginTop="20"
          medium
          bold
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          متن پیام
        </Text>
        <TextInput
          style={{
            ...styles.input,
            backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
          }}
          multiline={true}
          lineNums={10}
          onChangeText={handleTextInput}
          inputName="message"
        />
        <Button
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          mode="contained"
          style={[styles.btn, { width: '38%', height: 40, margin: 20 }]}
          loading={isSending ? true : false}
          disabled={isSending ? true : false}
          onPress={() => sendMessageToCounselor()}>
          <Text color="white">ارسال پیام</Text>
        </Button>
      </ScrollView>

      <TabBar seperate={true} navigation={navigation} />
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          visible={snackbar.visible}
          handleVisible={handleVisible}
        />
      ) : null}
    </Container>
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
    width: '75%',
    marginTop: 0,
  },
  btn: {
    width: '40%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default ContactCounselorScreen;
