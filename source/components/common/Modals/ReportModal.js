/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Checkbox } from 'react-native-paper';

import { Button, Text } from '../index';
import { rw, rh, COLORS } from '../../../configs';

const ReportModal = ({ type, title, visible, closeModal }) => {
  const [inapropriateContent, setInapropriateContent] = useState(false);
  const [rudeness, setRudeness] = useState(false);
  const [others, setOthers] = useState(false);
  const [description, setDescription] = useState(null);

  const onReport = () => {
    // call api for delete...
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
      onBackdropPress={closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ marginLeft: 'auto' }} />
          <View style={{ marginLeft: 'auto', marginRight: rw(2) }}>
            <Text medium color={COLORS.textDark}>
              گزارش {title}
            </Text>
          </View>

          <Pressable
            onPress={closeModal}
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

        <View style={{ paddingHorizontal: rw(2) }}>
          <Text color={COLORS.textLight} marginTop={rh(2)}>
            لطفا دلیل خود را برای گزارش و بازبینی این خاطره توسط کارشناسان ما را
            انتخاب کنید
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.checkBoxContainer}>
            <Text
              small
              color={inapropriateContent ? COLORS.primary : COLORS.textLight}>
              محتوای نامناسب
            </Text>
            <Checkbox
              uncheckedColor={COLORS.textLight}
              color={COLORS.primary}
              // disabled={isLoading ? true : false}
              status={inapropriateContent ? 'checked' : 'unchecked'}
              onPress={() => {
                setInapropriateContent(!inapropriateContent);
              }}
            />
          </View>
          <View style={styles.checkBoxContainer}>
            <Text
              small
              color={rudeness ? COLORS.primary : COLORS.textLight}
              marginTop={rh(1)}>
              استفاده از کلمات توهین آمیز در متن خاطره
            </Text>
            <Checkbox
              uncheckedColor={COLORS.textLight}
              color={COLORS.primary}
              // disabled={isLoading ? true : false}
              status={rudeness ? 'checked' : 'unchecked'}
              onPress={() => {
                setRudeness(!rudeness);
              }}
            />
          </View>
          <View style={styles.checkBoxContainer}>
            <Text small color={others ? COLORS.primary : COLORS.textLight}>
              سایر
            </Text>
            <Checkbox
              uncheckedColor={COLORS.textLight}
              color={COLORS.primary}
              // disabled={isLoading ? true : false}
              status={others ? 'checked' : 'unchecked'}
              onPress={() => {
                setOthers(!others);
              }}
            />
          </View>
        </View>

        <View style={styles.textInputContainer}>
          <Text
            color={COLORS.textLight}
            alignSelf="flex-end"
            marginRight={rw(8)}
            marginBottom={rh(1)}>
            توضیحات :
          </Text>
          <TextInput
            onChangeText={setDescription}
            placeholder="متن خاطره خود را اینجا وارد کنید"
            placeholderTextColor={COLORS.textLight}
            style={styles.inputArea}
            returnKeyType="next"
            multiline
          />
        </View>
        <Button
          title={`گزارش ${title}`}
          icon="send"
          color={COLORS.error}
          onPress={onReport}
          style={{ marginTop: 'auto', marginBottom: rh(3), width: rw(70) }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(85),
    elevation: 5,
    borderRadius: 25,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(2),
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: rh(2),
    marginVertical: rh(2),
  },
  inputArea: {
    backgroundColor: COLORS.inputTabBarBg,
    height: rh(20),
    width: rw(70),
    borderRadius: 10,
    color: COLORS.textLight,
    fontFamily: 'Qs_Iranyekan_bold',
    textAlign: 'right',
    textAlignVertical: 'top',
    fontSize: 14,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    width: '87%',
  },
  optionsContainer: {
    width: '100%',
    marginTop: rh(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportModal;
