/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Button, Text, InputRow } from '../../../../../components/common';
import { rw, rh, COLORS } from '../../../../../configs';

const PasswordFingerModal = ({ visible, closeModal, modalType }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
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
          <Text>
            {modalType === 'pass' ? 'رمز عبور' : 'اثر انگشت'} خود را وارد کنید
          </Text>
          <Pressable onPress={closeModal} hitSlop={7}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>
        <View style={{ marginTop: rh(2) }}>
          {modalType === 'pass' && (
            <InputRow
              title="رمز عبور :"
              placeholder="نام خود را اینجا وارد کنید"
              handleTextInput={setName}
              name="name"
              containerStyle={styles.input}
              //   required={!name ? true : false}
              //   tipText="وارد کردن نام الزامی است"
            />
          )}
        </View>

        {modalType === 'pass' && (
          <Button
            title="تایید اطلاعات"
            icon="checkmark-sharp"
            color={COLORS.success}
            //   onPress={onSelectDate}
            style={{ marginTop: 'auto', marginBottom: rh(4) }}
          />
        )}
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
export default PasswordFingerModal;
