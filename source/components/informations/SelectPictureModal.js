/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import { Text } from '../common';
import { rw, rh, COLORS } from '../../configs';

const SelectPictureModal = ({
  visible,
  closeModal,
  openPicker,
  openCamera,
  showDelete = true,
  removePic,
  isUpdating = false,
}) => {
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
      onBackdropPress={isUpdating ? () => {} : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ marginLeft: 'auto' }} />
          <Text medium style={{ marginLeft: 'auto', marginRight: rw(5) }}>
            انتخاب عکس
          </Text>
          <Pressable
            onPress={isUpdating ? () => {} : closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Image
              source={require('../../assets/icons/btns/close.png')}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>

        <Pressable style={{ ...styles.row, marginTop: rh(4) }}>
          <Image
            source={require('../../assets/icons/btns/disabled-back.png')}
            style={{ width: 25, height: 25 }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text marginRight={rw(2)}>انتخاب از بین عکس های پیشفرض</Text>
            <Image
              source={require('../../assets/icons/profilePrivacy/images.png')}
              style={{ width: 25, height: 25 }}
            />
          </View>
        </Pressable>
        <Pressable
          onPress={isUpdating ? () => {} : openPicker}
          style={styles.row}>
          <Image
            source={require('../../assets/icons/btns/disabled-back.png')}
            style={{ width: 25, height: 25 }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text marginRight={rw(2)}>انتخاب عکس از گالری</Text>
            <Image
              source={require('../../assets/icons/profilePrivacy/gallery.png')}
              style={{ width: 25, height: 25 }}
            />
          </View>
        </Pressable>
        <Pressable
          close
          onPress={isUpdating ? () => {} : openCamera}
          style={styles.row}>
          <Image
            source={require('../../assets/icons/btns/disabled-back.png')}
            style={{ width: 25, height: 25 }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text marginRight={rw(2)}>باز کردن دوربین</Text>
            <Image
              source={require('../../assets/icons/profilePrivacy/camera.png')}
              style={{ width: 25, height: 25 }}
            />
          </View>
        </Pressable>
        {isUpdating && (
          <ActivityIndicator
            size="small"
            color={COLORS.borderLinkBtn}
            style={{ marginTop: rh(2) }}
          />
        )}
        {showDelete && (
          <Pressable
            onPress={isUpdating ? () => {} : () => removePic()}
            style={styles.deleteContainer}>
            <Text marginRight={rw(1)} color={COLORS.error}>
              حذف عکس فعلی
            </Text>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </Pressable>
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
    width: rw(100),
    height: rh(45),
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
    width: 25,
    height: 25,
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
  deleteContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: rh(2),
  },
});
export default SelectPictureModal;
