/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';

import SelectPictureModal from '../../components/informations/SelectPictureModal';
import {
  Button,
  InputRow,
  Snackbar,
  ScreenHeader,
  BackgroundView,
} from '../../components/common';

import { rw, rh, COLORS, baseUrl, ICON_SIZE } from '../../configs';
import getLoginClient from '../../libs/api/loginClientApi';

import manIcon from '../../assets/vectors/profile/man-1.png';
import EnabledEdit from '../../assets/icons/btns/enabled-edit.svg';

const UpdateRelScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const [partner, setPartner] = useState(params.rel.man_name);
  const [partnerMobile, setPartnerMobile] = useState(params.rel.man.mobile);
  const [picture, setPicture] = useState(
    params.rel.man_image ? baseUrl + params.rel.man_image : '',
  );
  const [isAdding, setIsAdding] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
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

  const onUpdateRel = async (id) => {
    setIsAdding(true);
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', params.rel.id);
    formData.append('gender', 'woman');
    formData.append('man_name', partner);
    formData.append('mobile', partnerMobile);
    if (picture) {
      formData.append('man_image', {
        uri: picture,
        name: 'spouseImg.png',
        type: 'image/png',
      });
    }
    loginClient.post('update/relation', formData).then((response) => {
      setIsAdding(false);
      if (response.data.is_successful) {
        setSnackbar({
          msg: 'اطلاعات همسر شما با موفقیت ویرایش شد.',
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
    });
  };

  return (
    <BackgroundView>
      <View style={styles.content}>
        <ScreenHeader title="ویرایش اطلاعات پارتنر" disableBack={isAdding} />

        <View
          style={{
            ...styles.avatarBorderdContainer,
            width: 110,
            height: 110,
            marginTop: rh(2),
          }}>
          {picture ? (
            <View style={styles.avatarBorderdContainer}>
              <Image
                source={{ uri: picture }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            </View>
          ) : (
            <View style={styles.avatarBorderdContainer}>
              <Image
                source={manIcon}
                style={{ width: 80, height: 80, borderRadius: 70 }}
                resizeMode="contain"
              />
            </View>
          )}

          <Pressable
            style={styles.plusIconContainer}
            hitSlop={7}
            onPress={() => setShowPictureModal(true)}>
            <FontAwesome5 name="plus" size={20} color={COLORS.white} />
          </Pressable>
        </View>

        <View style={{ marginTop: rh(2) }}>
          <InputRow
            title="نام :"
            placeholder="نام پارتنر را اینجا وارد کنید"
            handleTextInput={setPartner}
            name="pName"
            editedText={partner}
            containerStyle={styles.input}
          />
          <InputRow
            title="شماره موبایل :"
            placeholder="شماره موبایل پارتنر را اینجا وارد کنید"
            handleTextInput={setPartnerMobile}
            name="pMobile"
            kType="numeric"
            editedText={partnerMobile}
            containerStyle={styles.input}
          />
        </View>

        <Button
          disabled={isAdding}
          loading={isAdding}
          title="ویرایش اطلاعات"
          Icon={() => <EnabledEdit style={ICON_SIZE} />}
          color={COLORS.borderLinkBtn}
          onPress={() => onUpdateRel()}
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
    alignItems: 'center',
    width: rw(100),
    flex: 1,
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
export default UpdateRelScreen;
