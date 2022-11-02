/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Button,
  Text,
  InputRow,
  Snackbar,
} from '../../../../components/common';
import { rw, rh, COLORS } from '../../../../configs';
import { verifyRelation } from '../../../../libs/apiCalls';
import { useApi } from '../../../../libs/hooks';

const VerifyRelModal = ({ visible, closeModal, edit = null }) => {
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

  const onVerifyRel = async () => {
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
      onBackdropPress={closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ width: rw(11) }} />
          <Text>تایید رابطه</Text>
          <Pressable onPress={closeModal} hitSlop={7}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>

        <View style={{ marginTop: rh(6) }}>
          <InputRow
            title="کد تایید رابطه :"
            placeholder="کد تایید رابطه را اینجا وارد کنید"
            handleTextInput={setVerificationCode}
            name="pName"
            containerStyle={styles.input}
          />
        </View>

        <Button
          title="تایید رابطه"
          icon={edit.isEdit ? 'pencil' : 'checkmark-sharp'}
          color={edit.isEdit ? COLORS.borderLinkBtn : COLORS.success}
          loading={verifyCode.isFetching}
          disabled={verifyCode.isFetching}
          onPress={onVerifyRel}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
        />
      </View>
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  avatarBorderdContainer: {
    backgroundColor: COLORS.inputTabBarBg,
    width: 90,
    height: 90,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    width: rw(100),
    height: rh(40),
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
export default VerifyRelModal;
