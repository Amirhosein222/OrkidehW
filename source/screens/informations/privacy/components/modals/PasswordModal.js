/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Button,
  Text,
  InputRow,
  Snackbar,
} from '../../../../../components/common';

import { rw, rh, COLORS } from '../../../../../configs';
import { WomanInfoContext } from '../../../../../libs/context/womanInfoContext';
import { useApi } from '../../../../../libs/hooks';
import { setPasswordApi } from '../../api';

const PasswordModal = ({ visible, closeModal, modalType, handleSnackbar }) => {
  const { fullInfo, saveFullInfo } = useContext(WomanInfoContext);
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const [submitPassword, setSubmitPassword] = useApi(() =>
    setPasswordApi(fullInfo, password),
  );

  const onSetPass = async function () {
    if (!password) {
      return setSnackbar({
        msg: 'لطفا ابتدا رمز عبور را وارد کنید',
        visible: true,
      });
    }
    setSubmitPassword();
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onClose = (status) => {
    closeModal(status);
  };

  useEffect(() => {
    if (submitPassword.data && submitPassword.data.is_successful) {
      setPassword('');
      saveFullInfo(submitPassword.data.data);
      AsyncStorage.setItem('isPassActive', 'true');
      AsyncStorage.setItem(
        'fullInfo',
        JSON.stringify(submitPassword.data.data),
      );
      handleSnackbar({
        msg: 'رمز عبور شما ثبت شد',
        visible: true,
        type: 'success',
      });
      onClose(true);
    }
    submitPassword.data &&
      !submitPassword.data.is_successful &&
      handleSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [submitPassword]);

  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      coverScreen={true}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={0}
      animationOutTiming={0}
      animationInTiming={0}
      animationIn="slideInUp"
      onBackdropPress={
        submitPassword.isFetching ? () => {} : () => onClose(false)
      }
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ width: rw(11) }} />
          <Text>
            {modalType === 'password' ? 'رمز عبور' : 'اثر انگشت'} خود را وارد
            کنید
          </Text>
          <Pressable
            onPress={
              submitPassword.isFetching ? () => {} : () => onClose(false)
            }
            hitSlop={7}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>
        <View style={{ marginTop: rh(2) }}>
          {modalType === 'password' && (
            <InputRow
              title="رمز عبور :"
              placeholder="رمز عبور مورد نظر خود را اینجا وارد کنید"
              handleTextInput={setPassword}
              name="password"
              containerStyle={styles.input}
            />
          )}
        </View>

        <Button
          title="تایید اطلاعات"
          icon="checkmark-sharp"
          disabled={submitPassword.isFetching}
          loading={submitPassword.isFetching}
          color={COLORS.success}
          onPress={onSetPass}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
        />
      </View>
      {snackbar.visible && (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  content: {
    alignItems: 'center',
    width: rw(100),
    height: rh(50),
    marginTop: 'auto',
    elevation: 5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: rh(2),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
  input: {
    marginTop: rh(2),
  },
});
export default PasswordModal;
