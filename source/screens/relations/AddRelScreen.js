/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';

import SelectPictureModal from '../../components/informations/SelectPictureModal';
import {
  Button,
  Divider,
  InputRow,
  Snackbar,
  ScreenHeader,
  BackgroundView,
} from '../../components/common';

import { validatePhoneNumber } from '../../libs/helpers';
import { rw, rh, COLORS } from '../../configs';
import getLoginClient from '../../libs/api/loginClientApi';

import enabledCheck from '../../assets/icons/btns/enabled-check.png';

const AddRelScreen = ({ navigation, route }) => {
  const params = route.params || {};

  const [partner, setPartner] = useState('');
  const [partnerMobile, setPartnerMobile] = useState('');
  const [picture, setPicture] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const verifyInfo = function () {
    if (!partner || !partnerMobile) {
      setSnackbar({
        msg: 'فیلد های نام و شماره تلفن همراه الزامی می باشند!',
        visible: true,
      });
      return false;
    }
    if (!validatePhoneNumber(partnerMobile)) {
      setSnackbar({
        msg: 'فرمت تلفن همراه معتبر نیست.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const onSubmitRel = async () => {
    if (verifyInfo()) {
      setIsAdding(true);
      const loginClient = await getLoginClient();
      const formData = new FormData();
      formData.append('mobile', partnerMobile);
      if (picture) {
        formData.append('man_image', {
          uri: picture,
          name: 'spouseImg.png',
          type: 'image/png',
        });
      }
      formData.append('man_name', partner);
      formData.append('gender', 'woman');
      loginClient
        .post('store/relation', formData)
        .then((response) => {
          setIsAdding(false);
          if (response.data.is_successful) {
            setSnackbar({
              msg: 'اطلاعات همسر شما با موفقیت ثبت شد.',
              visible: true,
              type: 'success',
            });
            setPartner('');
            setPartnerMobile('');
            setPicture('');
            params.handleUpdateRels();
            navigation.goBack();
          } else {
            setSnackbar({
              msg: response.data.message,
              visible: true,
            });
          }
        })
        .catch((e) => {
          setIsAdding(false);
          // console.log('Error at Adding Spouse ', e.response.data);
        });
    }
  };

  const selectPicture = function (camera = false) {
    if (camera) {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      }).then((image) => {
        setShowPictureModal(false);
        setPicture(image.path);
      });
    } else {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      }).then((image) => {
        setShowPictureModal(false);
        setPicture(image.path);
      });
    }
  };

  return (
    <BackgroundView>
      <View style={styles.content}>
        <ScreenHeader title="افزودن پارتنر جدید" disableBack={isAdding} />

        <View
          style={{
            ...styles.avatarBorderdContainer,
            width: 110,
            height: 110,
            marginTop: rh(2),
          }}>
          {picture ? (
            <Image
              source={{ uri: picture }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View style={styles.avatarBorderdContainer}>
              <FontAwesome5 name="camera" size={55} color={COLORS.textDark} />
            </View>
          )}

          <Pressable
            style={styles.plusIconContainer}
            hitSlop={7}
            onPress={() => setShowPictureModal(true)}>
            <FontAwesome5 name="plus" size={20} color={COLORS.white} />
          </Pressable>
        </View>
        <Divider
          width={rw(80)}
          color={COLORS.textDark}
          style={{ borderBottomWidth: 0.4, marginTop: rh(4) }}
        />
        <View style={{ marginTop: rh(3) }}>
          <InputRow
            title="نام :"
            placeholder="نام پارتنر خود را اینجا وارد کنید"
            handleTextInput={setPartner}
            name="pName"
            containerStyle={styles.input}
          />
          <InputRow
            title="شماره موبایل :"
            placeholder="شماره موبایل پارتنر خود را اینجا وارد کنید"
            handleTextInput={setPartnerMobile}
            name="pMobile"
            kType="numeric"
            containerStyle={styles.input}
          />
        </View>

        <Button
          disabled={isAdding}
          loading={isAdding}
          title="ثبت اطلاعات"
          icons={[enabledCheck, enabledCheck]}
          color={COLORS.primary}
          onPress={() => onSubmitRel()}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
        />
      </View>
      {showPictureModal && (
        <SelectPictureModal
          visible={showPictureModal}
          closeModal={() => setShowPictureModal(false)}
          openPicker={() => selectPicture()}
          openCamera={() => selectPicture(true)}
          removePic={() => setPicture(false)}
          showDelete={picture ? true : false}
        />
      )}
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.mainBg,
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: rw(100),
    // backgroundColor: COLORS.mainBg,
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
  plusIconContainer: {
    width: rw(9.5),
    height: rh(4.5),
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    top: rh(9),
  },
});
export default AddRelScreen;
