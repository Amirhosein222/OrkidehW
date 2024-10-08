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

import { Text } from '../common';
import { rw, rh, COLORS, ICON_SIZE } from '../../configs';

import ImagesIcon from '../../assets/icons/profilePrivacy/images.svg';
import DisabledBack from '../../assets/icons/btns/disabled-back.svg';
import Camera from '../../assets/icons/profilePrivacy/camera.svg';
import Gallery from '../../assets/icons/profilePrivacy/gallery.svg';
import Close from '../../assets/icons/btns/close.svg';
import Delete from '../../assets/icons/btns/delete.svg';

const SelectPictureModal = props => {
  const {
    visible,
    closeModal,
    openPicker,
    openCamera,
    showDelete = true,
    removePic,
    isUpdating = false,
    openDefaultImages,
  } = props;
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
          <Text
            size={12}
            color={COLORS.textCommentCal}
            bold
            style={{ marginLeft: 'auto', marginRight: rw(5) }}>
            انتخاب عکس
          </Text>
          <Pressable
            onPress={isUpdating ? () => {} : closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Close style={{ ...ICON_SIZE, marginRight: rw(5) }} />
          </Pressable>
        </View>

        <Pressable
          onPress={openDefaultImages}
          style={{ ...styles.row, marginTop: rh(4) }}>
          <DisabledBack style={ICON_SIZE} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text marginRight={rw(2)}>انتخاب از بین عکس های پیشفرض</Text>
            <ImagesIcon style={ICON_SIZE} />
          </View>
        </Pressable>
        <Pressable
          onPress={isUpdating ? () => {} : openPicker}
          style={styles.row}>
          <DisabledBack style={ICON_SIZE} />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text marginRight={rw(2)}>انتخاب عکس از گالری</Text>
            <Gallery style={ICON_SIZE} />
          </View>
        </Pressable>
        <Pressable
          close
          onPress={isUpdating ? () => {} : openCamera}
          style={styles.row}>
          <DisabledBack style={ICON_SIZE} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text marginRight={rw(2)}>باز کردن دوربین</Text>
            <Camera style={ICON_SIZE} />
          </View>
        </Pressable>
        {isUpdating && (
          <ActivityIndicator
            size="small"
            color={COLORS.borderLinkBtn}
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
          />
        )}
        {showDelete && (
          <Pressable
            onPress={isUpdating ? () => {} : () => removePic()}
            style={styles.deleteContainer}>
            <Text marginRight={rw(1)} color={COLORS.error}>
              حذف عکس فعلی
            </Text>
            <Delete style={ICON_SIZE} />
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
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
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
