/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Button, Text } from '../../../../components/common';

import { useIsPeriodDay } from '../../../../libs/hooks';
import { COLORS, rh, rw } from '../../../../configs';

import DoneImage from '../../../../assets/icons/others/done.png';

const CounselorResponseModal = ({ visible, closeModal }) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.1}
      backdropTransitionOutTiming={1}
      animationOutTiming={0}
      animationInTiming={0}
      onBackdropPress={() => closeModal()}
      animationIn="zoomIn"
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: 'white',
        }}>
        <View style={styles.header}>
          <AntDesign
            onPress={() => closeModal()}
            name="close"
            size={26}
            color={COLORS.expSympReadMore}
            style={styles.closeIcon}
          />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={DoneImage}
            style={{ width: 180, height: 180 }}
            resizeMode="contain"
          />
        </View>

        <Text
          size={14}
          color={COLORS.expSympTitle}
          bold
          large
          marginTop={rh(2)}>
          پیام شما با موفقیت ثبت شد
        </Text>
        <Text
          color={COLORS.textLight}
          bold
          marginTop={rh(1)}
          marginBottom={rh(2)}
          textAlign="right"
          alignSelf="center">
          پیام شما با موفقیت برای ما ارسال شد پس از بازبینی توسط کارشناسان ما،
          با شما تماس گرفته می شود
        </Text>
        <Button
          title="بستن"
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          onPress={() => closeModal()}
          style={{
            width: rw(60),
            marginBottom: rh(0),
            marginTop: 'auto',
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  closeIcon: {
    marginRight: rw(2),
  },
  icon: {
    width: 100,
    height: 100,
  },
  modalContent: {
    alignSelf: 'center',
    width: '85%',
    borderRadius: 20,
    paddingHorizontal: rw(3),
    paddingVertical: rh(2),
    elevation: 5,
    alignItems: 'center',
    // height: rh(45),
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
    margin: 10,
  },
  btn: { width: '40%', height: 40, margin: 20, alignSelf: 'center' },
  imageContainer: {
    alignItems: 'center',
    width: rw(71),
    marginTop: rh(4),
  },
});

export default CounselorResponseModal;
