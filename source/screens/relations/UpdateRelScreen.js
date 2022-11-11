/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import SelectPictureModal from '../../components/informations/SelectPictureModal';
import {
  Button,
  InputRow,
  Snackbar,
  ScreenHeader,
  BackgroundView,
  Divider,
} from '../../components/common';
import SelectPicture from './components/selectPicture';

import { rw, rh, COLORS, baseUrl, ICON_SIZE } from '../../configs';

import { updateRelApi } from './apis';
import EnabledEdit from '../../assets/icons/btns/enabled-edit.svg';
import { useIsPeriodDay, useApi } from '../../libs/hooks';
import verifyInfo from './helpers/verifyInfo';

const UpdateRelScreen = ({ navigation, route }) => {
  const isPeriodDay = useIsPeriodDay();

  const params = route.params || {};
  const [partner, setPartner] = useState(params.rel.label);
  const [partnerMobile, setPartnerMobile] = useState(params.rel.mobile);
  const [picture, setPicture] = useState(
    params.rel.image ? baseUrl + params.rel.image : '',
  );
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [update, setUpdate] = useApi(() =>
    updateRelApi(params.rel.value, partner, partnerMobile, picture),
  );

  const onUpdateRel = () => {
    if (verifyInfo(partner, partnerMobile, setSnackbar)) {
      setUpdate();
    }
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onDefaultImagePress = () => {
    setShowPictureModal(false);

    navigation.navigate('DefaultImages', {
      atEnterInfo: false,
      updateImage: setPicture,
      isUpdating: null,
      setShowPictureModal,
    });
  };

  const selectPicture = function (camera = false) {
    if (camera) {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      }).then(image => {
        setShowPictureModal(false);
        setPicture(image.path);
      });
    } else {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      }).then(image => {
        setShowPictureModal(false);
        setPicture(image.path);
      });
    }
  };

  useEffect(() => {
    if (update.data && update.data.is_successful) {
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
    }
    update.data &&
      !update.data.is_successful &&
      setSnackbar({
        msg: update.data.message,
        visible: true,
      });
  }, [update]);

  return (
    <BackgroundView>
      <View style={styles.content}>
        <ScreenHeader
          title="ویرایش اطلاعات پارتنر"
          disableBack={update.isFetching}
        />
        <SelectPicture
          picture={picture}
          setShowPictureModal={setShowPictureModal}
          isUpdate={true}
        />

        <Divider
          color={COLORS.textDark}
          width={rw(76)}
          style={{
            borderBottomWidth: 0.5,
            marginTop: rh(2),
          }}
        />
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
          disabled={update.isFetching}
          loading={update.isFetching}
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
          openDefaultImages={onDefaultImagePress}
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
