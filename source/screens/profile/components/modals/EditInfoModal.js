/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useContext } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment-jalaali';

import {
  Button,
  Text,
  InputRow,
  Snackbar,
} from '../../../../components/common';
import { rw, rh, COLORS } from '../../../../configs';
import getLoginClient from '../../../../libs/api/loginClientApi';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showSnackbar } from '../../../../libs/helpers';

const EditInfoModal = ({ title, visible, closeModal, displayName }) => {
  const { fullInfo, saveFullInfo } = useContext(WomanInfoContext);
  const [name, setName] = useState(displayName ? displayName : '');
  const [username, setUsername] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const updateName = async function () {
    if (name) {
      const loginClient = await getLoginClient();
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('display_name', name);
      formData.append(
        'birth_date',
        moment(fullInfo.birth_date, 'X').locale('en').format('jYYYY/jMM/jDD'),
      );
      formData.append('gender', 'woman');
      formData.append(
        'is_password_active',
        Number(fullInfo.is_password_active),
      );
      formData.append('is_finger_active', Number(fullInfo.is_finger_active));
      formData.append('password', '');
      formData.append('repeat_password', '');
      loginClient
        .post('complete/profile', formData)
        .then((response) => {
          setIsUpdating(false);
          if (response.data.is_successful) {
            saveFullInfo(response.data.data);
            AsyncStorage.setItem(
              'fullInfo',
              JSON.stringify(response.data.data),
            );
            showSnackbar('اطلاعات شما با موفقیت ویرایش شد', 'success');
            closeModal();
          } else {
            setSnackbar({
              msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
              visible: true,
            });
          }
        })
        .catch((e) => {
          // console.log(e);
        });
    } else {
      setSnackbar({
        msg: 'لطفا نام را وارد کنید.',
        visible: true,
      });
    }
  };

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
      onBackdropPress={isUpdating ? null : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ width: rw(11) }} />
          <Text>{title} خود را وارد کنید</Text>
          <Pressable onPress={isUpdating ? null : closeModal} hitSlop={7}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>
        <View style={{ marginTop: rh(6) }}>
          {title !== 'نام کاربری' && (
            <InputRow
              title="نام :"
              placeholder="نام خود را اینجا وارد کنید"
              handleTextInput={setName}
              name="name"
              containerStyle={styles.input}
              editedText={name}
            />
          )}
          {/* <InputRow
            title={title === 'نام کاربری' ? 'نام کاربری' : 'نام خانوادگی'}
            placeholder="نام کاربری خود را اینجا وارد کنید"
            handleTextInput={setUsername}
            name="username"
            containerStyle={styles.input}
          /> */}
        </View>

        <Button
          title="تایید اطلاعات"
          icon="checkmark-sharp"
          color={COLORS.success}
          disabled={isUpdating}
          loading={isUpdating}
          onPress={updateName}
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
  row: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: rh(2.5),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textDark,
    paddingBottom: rh(2),
  },
  input: {
    marginTop: rh(2),
  },
});
export default EditInfoModal;
