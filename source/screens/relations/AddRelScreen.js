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
} from '../../components/common';

import { addRelApi } from './apis';
import { rw, rh, COLORS, ICON_SIZE } from '../../configs';
import { useApi, useIsPeriodDay } from '../../libs/hooks';
import { verifyInfo } from './helpers';
import EnabledCheck from '../../assets/icons/btns/enabled-check.svg';

const AddRelScreen = ({ navigation, route }) => {
  const isPeriodDay = useIsPeriodDay();
  const params = route.params || {};

  const [partner, setPartner] = useState('');
  const [partnerMobile, setPartnerMobile] = useState('');
  const [picture, setPicture] = useState('');
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [addRel, setAddRel] = useApi(() =>
    addRelApi(partnerMobile, picture, partner),
  );

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onSubmitRel = () => {
    if (verifyInfo(partner, partnerMobile, setSnackbar)) {
      setAddRel();
    }
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

  const handleShowOrSetSnackbar = () => {
    params.showSnackbar
      ? params.showSnackbar({
          msg: 'اطلاعات همسر شما با موفقیت ثبت شد.',
          visible: true,
          type: 'success',
        })
      : setSnackbar({
          msg: 'اطلاعات همسر شما با موفقیت ثبت شد.',
          visible: true,
          type: 'success',
        });
  };

  useEffect(() => {
    if (addRel.data && addRel.data.is_successful) {
      handleShowOrSetSnackbar();
      setPartner('');
      setPartnerMobile('');
      setPicture('');
      params.handleUpdateRels();
      navigation.goBack();
    }
    addRel.data &&
      !addRel.data.is_successful &&
      setSnackbar({
        msg: addRel.data.message,
        visible: true,
      });
  }, [addRel]);

  return (
    <BackgroundView>
      <View style={styles.content}>
        <ScreenHeader title="افزودن دلبر " disableBack={addRel.isFetching} />
        <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <InputRow
            title="نام :"
            placeholder="نام دلبر را اینجا وارد کنید"
            handleTextInput={setPartner}
            name="pName"
            containerStyle={styles.input}
          />
          <InputRow
            title="شماره موبایل :"
            placeholder="شماره موبایل دلبر را اینجا وارد کنید"
            handleTextInput={setPartnerMobile}
            name="pMobile"
            kType="numeric"
            containerStyle={styles.input}
          />
        </View>

        <Button
          disabled={addRel.isFetching}
          loading={addRel.isFetching}
          title="ثبت اطلاعات"
          Icon={() => <EnabledCheck style={ICON_SIZE} />}
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          onPress={onSubmitRel}
          style={{ marginBottom: rh(4) }}
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
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.mainBg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: rw(100),
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
    marginTop: rh(1),
  },
});
export default AddRelScreen;
