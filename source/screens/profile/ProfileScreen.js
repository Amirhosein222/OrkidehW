/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment-jalaali';
import ImagePicker from 'react-native-image-crop-picker';

import { ProfileOption, EditInfoModal } from './components';
import { UserAvatarInfo } from '../settings/components';
import {
  ScreenHeader,
  Divider,
  BackgroundView,
  Snackbar,
} from '../../components/common';
import SelectPictureModal from '../../components/informations/SelectPictureModal';
import SelectBirthDayModal from '../../components/informations/SelectBirthDayModal';
import SelectMaritalModal from '../../components/informations/SelectMaritalModal';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { baseUrl, COLORS, rh, rw } from '../../configs';
import getLoginClient from '../../libs/api/loginClientApi';
import { convertToFullDate } from '../../libs/helpers';

import NameIcon from '../../assets/icons/profilePrivacy/name.svg';
import DateOfBirth from '../../assets/icons/profilePrivacy/dateOfBirth.svg';
import { ICON_SIZE } from '../../configs/styles';
import { useIsPeriodDay } from '../../libs/hooks';

const ProfileScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const { saveFullInfo, fullInfo } = useContext(WomanInfoContext);
  const [picture, setPicture] = useState(
    fullInfo.image ? baseUrl + fullInfo.image : '',
  );
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showMaritalModal, setShowMaritalModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const selectPicture = function (camera = false) {
    if (camera) {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      }).then(image => {
        setPicture(image.path);
        updatePicture(image.path);
      });
    } else {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      }).then(image => {
        setPicture(image.path);
        updatePicture(image.path);
      });
    }
  };

  const updatePicture = async function (pic, bDay = null) {
    setIsUpdating(true);

    const loginClient = await getLoginClient();
    const formData = new FormData();
    !bDay &&
      formData.append('image', {
        uri: pic,
        type: 'image/jpeg',
        name: 'profileImg',
      });
    formData.append('display_name', fullInfo.display_name);
    formData.append('name', fullInfo.name);
    formData.append(
      'birth_date',
      bDay
        ? bDay
        : moment(fullInfo.birth_date, 'X').locale('en').format('jYYYY/jMM/jDD'),
    );
    formData.append('gender', 'woman');
    formData.append('is_password_active', Number(fullInfo.is_password_active));
    formData.append('is_finger_active', Number(fullInfo.is_finger_active));
    formData.append('password', fullInfo.password);
    formData.append('repeat_password', fullInfo.password);
    loginClient
      .post('complete/profile', formData)
      .then(response => {
        setIsUpdating(false);
        bDay ? setShowBirthdayModal(false) : setShowPictureModal(false);
        if (response.data.is_successful) {
          setPicture(baseUrl + response.data.data.image);
          saveFullInfo(response.data.data);
          setSnackbar({
            msg: 'اطلاعات شما با موفقیت ویرایش شد',
            visible: true,
            type: 'success',
          });
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      })
      .catch(e => {
        // console.log(e);
      });
  };

  const onDefaultImagePress = () => {
    setShowPictureModal(false);

    navigation.navigate('DefaultImages', {
      atEnterInfo: false,
      updateImage: updatePicture,
      isUpdating: isUpdating,
      setShowPictureModal,
    });
  };

  const onOptionPress = option => {
    setSelectedOption(option);
    setShowModal(true);
  };

  return (
    <BackgroundView>
      <ScreenHeader title="پروفایل" />
      <View style={styles.content}>
        <UserAvatarInfo
          profile={true}
          openPicker={() => setShowPictureModal(true)}
          picture={picture}
        />
        <Divider
          color={COLORS.textDark}
          width="95%"
          style={{ marginTop: rh(4), marginBottom: rh(2) }}
          borderWidth={0.5}
        />
        <ProfileOption
          name="username"
          title="نام نمایشی"
          data={fullInfo.display_name}
          Icon={() => <NameIcon style={ICON_SIZE} />}
          onPress={onOptionPress}
        />
        <ProfileOption
          name="name"
          title="نام"
          data={fullInfo.name}
          Icon={() => <NameIcon style={ICON_SIZE} />}
          onPress={onOptionPress}
        />
        <ProfileOption
          name="birthday"
          title="تاریخ تولد"
          data={convertToFullDate(fullInfo.birth_date)}
          Icon={() => <DateOfBirth style={ICON_SIZE} />}
          onPress={() => setShowBirthdayModal(true)}
        />
        <ProfileOption
          name="birthday"
          title="وضعیت تاهل"
          data={fullInfo.status_married}
          Icon={() => <DateOfBirth style={ICON_SIZE} />}
          onPress={() => setShowMaritalModal(true)}
        />
      </View>
      {showBirthdayModal && (
        <SelectBirthDayModal
          visible={showBirthdayModal}
          closeModal={() => setShowBirthdayModal(false)}
          atProfile={{ profile: true, isPeriodDay: isPeriodDay }}
          updateBirthday={updatePicture}
          isUpdating={isUpdating}
        />
      )}
      {showPictureModal && (
        <SelectPictureModal
          visible={showPictureModal}
          closeModal={() => setShowPictureModal(false)}
          openPicker={() => selectPicture()}
          openCamera={() => selectPicture(true)}
          openDefaultImages={onDefaultImagePress}
          removePic={() => setPicture(false)}
          showDelete={picture && !isUpdating ? true : false}
          isUpdating={isUpdating}
        />
      )}
      {showMaritalModal && (
        <SelectMaritalModal
          defaultValue={fullInfo.status_married}
          visible={showMaritalModal}
          closeModal={() => setShowMaritalModal(false)}
          setSnackbar={setSnackbar}
        />
      )}
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={() =>
            setSnackbar({
              visible: !snackbar.visible,
            })
          }
        />
      ) : null}
      {showModal && (
        <EditInfoModal
          title={selectedOption}
          visible={showModal}
          closeModal={() => setShowModal(false)}
          displayName={fullInfo.display_name}
          oldName={fullInfo.name}
          setSnackbar={setSnackbar}
        />
      )}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
    alignItems: 'center',
    width: rw(100),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(82),
    marginTop: rh(2),
    paddingBottom: rh(4),
  },
  image: {
    width: 100,
    height: 100,
    marginTop: rh(2),
  },
});

export default ProfileScreen;
