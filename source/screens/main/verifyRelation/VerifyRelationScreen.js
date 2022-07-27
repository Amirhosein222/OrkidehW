/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-paper';

import { useApi, useIsPeriodDay } from '../../../libs/hooks';
import { verifyRelation } from '../../../libs/apiCalls';

import { Text, Header, TabBar, Snackbar } from '../../../components/common';
import { COLORS, STATUS_BAR_HEIGHT, rh, rw } from '../../../configs';

const VerifyRelationScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [verificationCode, setVerificationCode] = useState('');
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [verifyCode, setVerifyCode] = useApi(() =>
    verifyRelation(verificationCode),
  );

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onVerifyCode = async () => {
    if (verificationCode) {
      await setVerifyCode();
    } else {
      setSnackbar({ msg: 'لطفا ابتدا کد تایید را وارد کنید.', visible: true });
    }
  };

  useEffect(() => {
    if (verifyCode.data && verifyCode.data.is_successful) {
      setVerificationCode('');
      setSnackbar({
        msg: 'رابطه شما با موفقیت تایید شد.',
        visible: true,
        type: 'success',
      });
    }
    if (verifyCode.data && !verifyCode.data.is_successful) {
      setSnackbar({
        msg:
          verifyCode.data.status === 404
            ? 'رابطه ای با این کد تایید ثبت نشده است.'
            : 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
    }
  }, [verifyCode]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
      />

      <View
        style={{
          ...styles.inputContainer,
          backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
          elevation: isPeriodDay ? 3 : 0,
        }}>
        <Text marginTop="10" medium bold color="black">
          کد تایید رابطه را وارد کنید
        </Text>
        <TextInput
          style={{
            ...styles.input,
            backgroundColor: 'white',
          }}
          onChangeText={setVerificationCode}
          value={verificationCode}
          placeholder="کد تایید"
        />
        <Button
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          mode="contained"
          style={[styles.btn]}
          loading={verifyCode.isFetching}
          onPress={() => onVerifyCode()}>
          <Text color="white">ارسال</Text>
        </Button>
      </View>

      <TabBar seperate={true} navigation={navigation} />

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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputContainer: {
    width: '80%',
    backgroundColor: COLORS.lightRed,
    alignItems: 'center',
    padding: 10,
    elevation: 3,
    borderRadius: 10,
    height: rh(30),
  },
  input: {
    width: rw(65),
    borderRadius: 7,
    paddingLeft: rw(2),
    marginTop: rh(2),
    elevation: 3,
    fontFamily: 'Vazir',
  },
  btn: { width: '30%', height: 40, marginTop: 'auto', elevation: 3 },
});

export default VerifyRelationScreen;
