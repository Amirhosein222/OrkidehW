/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Keyboard, Pressable, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { InputRow, Text, Button } from '../../../../components/common';

import { useIsPeriodDay } from '../../../../libs/hooks';
import getLoginClient from '../../../../libs/api/loginClientApi';
import { COLORS, rh, rw } from '../../../../configs';

import EnabledSend from '../../../../assets/icons/btns/enabled-send.svg';
import EnabledEdit from '../../../../assets/icons/btns/enabled-edit.svg';
import { ICON_SIZE } from '../../../../configs/styles';

const AddMemoryModal = ({
  visible,
  closeModal,
  handleNewMemory,
  edit = null,
  setSnackbar,
  id,
}) => {
  const isPeriodDay = useIsPeriodDay();
  let memory = {};
  const [mtitle, setMTitle] = useState(null);
  const [memoryText, setMemoryText] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const validateInfo = function () {
    if (!mtitle) {
      setSnackbar({
        msg: 'لطفا عنوان خاطره خود را وارد کنید.',
        visible: true,
      });
      return false;
    }
    if (!memoryText) {
      setSnackbar({
        msg: 'لطفا متن خاطره خود را وارد کنید.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const mergeMemoryDetails = function () {
    memory = {
      gender: 'woman',
      title: mtitle,
      text: memoryText,
    };
    if (edit.isEdit) {
      memory.memory_id = edit.memory.id;
    }
  };

  const addMemory = async function () {
    Keyboard.dismiss();
    const loginClient = await getLoginClient();
    if (validateInfo()) {
      mergeMemoryDetails();
      setIsSending(true);
      loginClient.post('store/memory', memory).then(response => {
        memory = {};
        setMTitle(null);
        setMemoryText(null);
        setIsSending(false);
        if (response.data.is_successful) {
          setSnackbar({
            msg: 'خاطره شما با موفقیت ثبت شد',
            visible: true,
            type: 'success',
          });
          handleNewMemory();
          closeModal();
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی پیش آمد، مجدد تلاش کنید.',
            visible: true,
          });
          closeModal();
        }
      });
    }
  };

  const updateMemory = async function () {
    Keyboard.dismiss();
    const loginClient = await getLoginClient();
    if (validateInfo()) {
      mergeMemoryDetails();
      setIsSending(true);
      loginClient.post('update/memory', memory).then(response => {
        setIsSending(false);
        if (response.data.is_successful) {
          setSnackbar({
            msg: 'خاطره شما با موفقیت ویرایش شد.',
            visible: true,
            type: 'success',
          });
          handleNewMemory();
          closeModal();
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجدد تلاش کنید',
            visible: true,
          });
          closeModal();
        }
      });
    }
  };

  useEffect(() => {
    if (edit.isEdit) {
      setMemoryText(edit.memory.text);
      setMTitle(edit.memory.title);
    }
  }, []);

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
      onBackdropPress={isSending ? null : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ marginLeft: 'auto' }} />
          <Text
            bold
            size={12}
            color={COLORS.textCommentCal}
            medium
            style={{
              marginLeft: 'auto',
              marginRight: edit.isEdit ? rw(6) : rw(2),
            }}>
            {edit.isEdit ? 'ویرایش خاطره' : 'خاطره خود را به اشتراک بگذارید'}
          </Text>
          <Pressable
            onPress={isSending ? null : closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>

        <InputRow
          title="عنوان :"
          placeholder="عنوان خاطره خود را اینجا وارد کنید"
          editedText={mtitle}
          handleTextInput={setMTitle}
          name="name"
          inputStyle={{ width: rw(60) }}
          textStyle={{ width: rw(22) }}
          containerStyle={{ marginTop: rh(4) }}
        />

        <View style={styles.textInputContainer}>
          <Text
            color={COLORS.textLight}
            alignSelf="flex-end"
            marginBottom={rh(1)}>
            متن خاطره:
          </Text>
          <TextInput
            onChangeText={setMemoryText}
            placeholder="متن خاطره خود را اینجا وارد کنید"
            placeholderTextColor={COLORS.textLight}
            style={styles.inputArea}
            returnKeyType="next"
            multiline
            value={memoryText}
          />
        </View>

        <Button
          title={edit.isEdit ? 'ویرایش خاطره' : 'ارسال'}
          Icon={
            edit.isEdit
              ? () => <EnabledEdit style={ICON_SIZE} />
              : () => <EnabledSend style={ICON_SIZE} />
          }
          color={
            isPeriodDay
              ? COLORS.fireEngineRed
              : edit.isEdit
              ? COLORS.borderLinkBtn
              : COLORS.primary
          }
          style={styles.btn}
          loading={isSending ? true : false}
          disabled={isSending ? true : false}
          onPress={edit.isEdit ? () => updateMemory() : () => addMemory()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  content: {
    width: rw(100),
    height: rh(54),
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
    justifyContent: 'center',
    marginTop: rh(2),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
  btn: {
    width: '82%',
    height: 40,
    margin: 20,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 'auto',
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '80%',
    alignSelf: 'center',
    marginTop: rh(2),
  },
  inputArea: {
    backgroundColor: COLORS.inputTabBarBg,
    height: rh(20),
    width: rw(81),
    borderRadius: 10,
    color: COLORS.textLight,
    fontFamily: 'IRANYekanMobileBold',
    textAlign: 'right',
    textAlignVertical: 'top',
    fontSize: 14,
  },
});
export default AddMemoryModal;
