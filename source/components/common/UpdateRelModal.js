/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Pressable, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import FormData from 'form-data';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

import getLoginClient from '../../libs/api/loginClientApi';
import { showSnackbar } from '../../libs/helpers';
import { useIsPeriodDay } from '../../libs/hooks';

import { Text, Snackbar } from './index';
import TextInput from './TextInput';
import { COLORS, rh, rw } from '../../configs';
import { validatePhoneNumber } from '../../libs/helpers';

const UpdateModal = ({ visible, closeModal, relation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [spouseName, setSpouseName] = useState(null);
  const [spouseNumber, setSpouseNumber] = useState(null);
  const [spousePicture, setSpousePicture] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text, name) {
    switch (name) {
      case 'spouseName':
        setSpouseName(text);
        break;
      case 'spouseNumber':
        setSpouseNumber(text);
        break;
      default:
        break;
    }
  };

  const selectPicture = function (remove = false) {
    if (remove) {
      setSpousePicture(null);
      return;
    }
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then((image) => {
      setSpousePicture(image.path);
      setSnackbar({
        msg: 'تصویر پروفایل با موفقیت انتخاب شد.',
        visible: true,
        type: 'success',
      });
    });
  };
  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  const verifyInfo = function () {
    if (!spouseName || !spouseNumber) {
      setSnackbar({
        msg: 'فیلد های نام و شماره تلفن همراه الزامی می باشند!',
        visible: true,
      });
      return false;
    }
    if (!validatePhoneNumber(spouseNumber)) {
      setSnackbar({
        msg: 'فرمت تلفن همراه معتبر نیست.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const updateRelation = async function (id) {
    if (verifyInfo()) {
      Keyboard.dismiss();
      const loginClient = await getLoginClient();
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('relation_id', relation.id);
      formData.append('gender', 'woman');
      formData.append('man_name', spouseName);
      if (spousePicture) {
        formData.append('man_image', {
          uri: spousePicture,
          name: 'spouseImg.png',
          type: 'image/png',
        });
      }

      loginClient.post('update/relation', formData).then((response) => {
        setIsUpdating(false);
        if (response.data.is_successful) {
          showSnackbar('تغییرات با موفقیت اعمال شد.', 'success');
          setSpouseName('');
          setSpouseNumber('');
          closeModal('', true);
        } else {
          showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
        }
      });
    }
  };

  useEffect(() => {
    setSpouseName(relation.man_name);
    setSpouseNumber(relation.man.mobile);
  }, [relation.man_name]);

  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.2}
      backdropTransitionOutTiming={1}
      animationOutTiming={0}
      animationInTiming={0}
      onBackdropPress={() => closeModal()}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.view}>
      <View
        style={{
          ...styles.modalContent,
          backgroundColor: '#ffffff',
        }}>
        <View style={styles.header}>
          <View style={{ marginLeft: rw(26) }}>
            <Text color={COLORS.dark} medium bold>
              ویرایش اطلاعات همسر
            </Text>
          </View>

          <AntDesign
            onPress={() => closeModal()}
            name="closecircle"
            size={26}
            color={isPeriodDay ? COLORS.lightRed : COLORS.lightPink}
            style={styles.closeIcon}
          />
        </View>
        <Text color={COLORS.dark} marginTop={rh(6)} medium>
          نام همسر
        </Text>
        <TextInput
          style={{
            ...styles.input,
            backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
          }}
          onChangeText={handleTextInput}
          inputName="spouseName"
          editedText={
            spouseName || spouseName === '' ? spouseName : relation.man_name
          }
        />
        <Text color={COLORS.dark} marginTop={rh(4)} medium>
          شماره موبایل همسر
        </Text>
        <TextInput
          style={{
            ...styles.input,
            backgroundColor: isPeriodDay ? COLORS.lightRed : COLORS.lightPink,
          }}
          keyboardType="numeric"
          onChangeText={handleTextInput}
          inputName="spouseNumber"
          editedText={
            spouseNumber || spouseNumber === ''
              ? spouseNumber
              : relation.man.mobile
          }
        />

        {spousePicture ? (
          <Pressable
            onPress={() => selectPicture(true)}
            style={{ marginTop: rh(4), alignItems: 'center' }}>
            <Text color={COLORS.dark} medium>
              حذف تصویر پروفایل
            </Text>
            <View style={styles.userIcon}>
              <Image
                source={{ uri: spousePicture }}
                style={{
                  height: 90,
                  width: 90,
                }}
              />
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => selectPicture()}
            style={{ marginTop: rh(4), alignItems: 'center' }}>
            <Text color={COLORS.dark} medium>
              انتخاب تصویر پروفایل
            </Text>
            <View
              style={{
                ...styles.userIcon,
                backgroundColor: isPeriodDay
                  ? COLORS.lightRed
                  : COLORS.lightPink,
              }}>
              <Icon name="user-alt" size={40} color={COLORS.white} />
            </View>
          </Pressable>
        )}

        <Button
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          mode="contained"
          style={[styles.btn, { width: '25%', height: 40, marginTop: 'auto' }]}
          loading={isUpdating ? true : false}
          onPress={() => updateRelation()}>
          <Text color={COLORS.white}>ثبت</Text>
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
    width: '100%',
    justifyContent: 'center',
  },
  userIcon: {
    width: 79,
    height: 79,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: rh(1),
  },
  closeIcon: {
    marginLeft: 'auto',
    marginRight: rw(3),
  },
  input: {
    backgroundColor: 'white',
    width: '75%',
    color: COLORS.dark,
    marginTop: rh(1),
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    height: '70%',
    justifyContent: 'center',
    elevation: 5,
    alignItems: 'center',
  },
  btn: { width: '40%', height: 40, margin: 20, alignSelf: 'center' },
});

export default UpdateModal;
