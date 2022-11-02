import React, { useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FormData from 'form-data';

import { showSnackbar } from '../../libs/helpers';
import getLoginClient from '../../libs/api/loginClientApi';

import { Text, TextInput, Snackbar } from './index';
import { COLORS } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const CommentModal = ({
  visible,
  closeModal,
  postId,
  parent_id,
  updateComments,
}) => {
  const isPeriodDay = useIsPeriodDay();
  const [comment, setComment] = useState('');
  const [btnPressed, setBtnPressed] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text) {
    setComment(text);
  };

  const validateComment = function () {
    if (!comment) {
      setSnackbar({
        msg: 'لطفا ابتدا نظر خود را وارد کنید.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const sendComment = async function () {
    if (validateComment()) {
      Keyboard.dismiss();
      setBtnPressed(true);
      const formData = new FormData();
      formData.append('post_id', postId);
      formData.append('post_type', 'post');
      formData.append('comment_text', comment);
      formData.append('parent_id', parent_id);
      formData.append('gender', 'woman');
      const loginClient = await getLoginClient();
      loginClient.post('comment/store', formData).then((response) => {
        setBtnPressed(false);
        if (response.data.is_successful) {
          showSnackbar('نظر شما با موفقیت ثبت شد.', 'success');
          updateComments();
          closeModal();
        } else {
          showSnackbar('مشکلی در ثبت نظر پیش آمده است');
          closeModal();
        }
      });
    }
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.2}
      backdropTransitionOutTiming={1}
      animationOutTiming={1}
      animationInTiming={0}
      onBackdropPress={() => closeModal()}
      animationIn="slideInUp"
      animationOut="fadeOut"
      style={styles.view}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text color="white" marginRight="10">
            نظر خود را بنویسید.
          </Text>
          <AntDesign
            onPress={() => closeModal()}
            name="closecircle"
            size={26}
            color="white"
            style={styles.closeIcon}
          />
        </View>
        <TextInput
          multiline={true}
          lineNums={3}
          style={styles.textArea}
          onChangeText={handleTextInput}
          textColor="black"
        />
        <Button
          color={COLORS.white}
          mode="contained"
          style={styles.btn}
          loading={btnPressed ? true : false}
          onPress={() => sendComment()}>
          <Text color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}>
            ارسال نظر
          </Text>
        </Button>
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
  view: {
    justifyContent: 'center',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    height: '40%',
    justifyContent: 'center',
    elevation: 5,
    alignItems: 'center',
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 20,
    width: '90%',
    marginTop: 20,
    fontSize: 12,
  },
  btn: { width: '40%', height: 40, margin: 20, alignSelf: 'center' },
});

export default CommentModal;
