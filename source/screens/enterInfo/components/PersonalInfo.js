/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  BackHandler,
  Image,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SelectBirthDayModal from '../../../components/informations/SelectBirthDayModal';
import SelectPictureModal from '../../../components/informations/SelectPictureModal';
import { Text, Snackbar, InputRow } from '../../../components/common';

import getLoginClient from '../../../libs/api/loginClientApi';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { COLORS, rw, rh } from '../../../configs';

import AddMemoriesIcon from '../../../assets/icons/btns/add-memories.svg';
import MaritalStatus from './MaritalStatus';

const PersonalInfo = ({ goToNextStage, editProfile, editName, navigation }) => {
  const { registerStage } = useContext(WomanInfoContext);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [family, setFamily] = useState('');
  const [marital, setMarital] = useState('');
  const [picture, setPicture] = useState('');
  const [birthday, setBirthday] = useState('');
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [fromDefaultImages, setFromDefaultImages] = useState(false);

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const selectPicture = function (remove = false, camera = false) {
    setFromDefaultImages(false);
    if (remove) {
      setShowPictureModal(false);
      setPicture(null);
      return;
    }
    if (camera) {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      }).then(image => {
        setShowPictureModal(false);
        setPicture(image);
      });
    } else {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      }).then(image => {
        setShowPictureModal(false);
        setPicture(image);
      });
    }
  };

  const onDefaultImagePress = () => {
    setShowPictureModal(false);
    navigation.navigate('DefaultImages', {
      atEnterInfo: true,
      updateImage: setPicture,
      isUpdating: null,
      handleDefaultImage: setFromDefaultImages,
      setShowPictureModal,
    });
  };

  const completeRegister = async function () {
    const loginClient = await getLoginClient();
    setIsLoading(true);
    const formData = new FormData();
    if (picture) {
      formData.append('image', {
        uri: fromDefaultImages ? picture : picture.path,
        type: 'image/jpeg',
        name: 'userAvatar',
      });
    }
    formData.append('display_name', username);
    formData.append('name', name);
    formData.append('birth_date', birthday);
    formData.append('status_married', marital);
    formData.append('is_password_active', 0);
    formData.append('is_finger_active', 0);
    formData.append('password', '');
    formData.append('repeat_password', '');
    formData.append('gender', 'woman');
    loginClient
      .post('complete/profile', formData)
      .then(response => {
        setIsLoading(false);
        if (response.data.is_successful) {
          goToNextStage(1);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است',
            visible: true,
          });
        }
      })
      .catch(e => {
        // console.log(e);
      });
  };

  useEffect(() => {
    setName(editName);
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (editProfile === true) {
        navigation.goBack();
      }
      Keyboard.scheduleLayoutAnimation('keyboardDidHide');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.content}>
        <View style={{ marginTop: rh(0) }}>
          <Text size={16} bold color={COLORS.textDark} marginTop={rh(1)}>
            اطلاعات شخصی
          </Text>
        </View>
        <View style={styles.userIconContainer}>
          {picture ? (
            <Image
              source={{ uri: fromDefaultImages ? picture : picture.path }}
              style={{ width: 90, height: 90, borderRadius: 50 }}
            />
          ) : (
            <Pressable style={styles.userIcon}>
              <Icon name="camera" color={COLORS.textLight} size={40} />
            </Pressable>
          )}

          <Pressable
            style={styles.plusIconContainer}
            hitSlop={7}
            onPress={() => setShowPictureModal(true)}>
            <AddMemoriesIcon style={{ width: 20, height: 20 }} />
          </Pressable>
        </View>
        <View>
          <InputRow
            title="نام نمایشی :"
            placeholder="نام نمایشی خود را اینجا وارد کنید"
            handleTextInput={setUsername}
            name="username"
            required={!username ? true : false}
            tipText="وارد کردن نام نمایشی الزامی است"
          />
          <Text
            size={9}
            color={COLORS.primary}
            alignSelf="flex-end"
            marginRight={rw(4)}>
            نام نمایشی در بخش خاطرات برای مشاهده سایر کاربران استفاده می شود
          </Text>
        </View>
        <View>
          <InputRow
            title="نام :"
            placeholder="نام خود را اینجا وارد کنید"
            handleTextInput={setName}
            name="name"
            required={!name ? true : false}
            tipText="وارد کردن نام الزامی است"
          />
          <Text
            size={9}
            color={COLORS.primary}
            alignSelf="flex-end"
            marginRight={rw(4)}>
            نام فقط برای مشاهده در بخش ارتباط با دلبر استفاده می شود
          </Text>
        </View>
        <InputRow
          title="نام خانوادگی :"
          placeholder="اختیاری"
          handleTextInput={setFamily}
          name="familyName"
        />
        <View
          style={{ width: rw(100), alignItems: 'center', marginBottom: rh(1) }}>
          <View style={styles.birthdayContainer}>
            <Pressable
              hitSlop={7}
              onPress={() => setShowBirthdayModal(true)}
              style={styles.calendarIconContainer}>
              <Image
                source={require('../../../assets/icons/btns/white-calendar.png')}
                style={{ width: 25, height: 25 }}
              />
            </Pressable>
            <View style={styles.birthdayText}>
              <Text color={COLORS.textLight} bold alignSelf="flex-end">
                {birthday ? birthday : '----/--/--'}
              </Text>
            </View>
            <View style={{ width: rw(27) }}>
              <Text size={11} color={COLORS.textLight} alignSelf="flex-end">
                تاریخ تولد :
              </Text>
            </View>
          </View>

          {!birthday && (
            <View
              style={{
                width: rw(50),
                alignSelf: 'center',
                right: rw(10.1),
                marginTop: rh(0.3),
              }}>
              <Text color={COLORS.error} size={8} bold alignSelf="flex-end">
                وارد کردن تاریخ تولد الزامی است
              </Text>
            </View>
          )}
        </View>

        <MaritalStatus setMarital={setMarital} selectedValue={marital} />

        <View style={styles.stepperContainer}>
          <View style={{ width: rw(24) }} />
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 'auto',
              marginRight: rw(6),
            }}>
            <MaterialIcons
              name="circle"
              color={registerStage === 0 ? COLORS.primary : COLORS.icon}
              size={14}
              style={{ marginRight: rw(1.5) }}
            />
            <MaterialIcons
              name="circle"
              color={registerStage === 1 ? COLORS.primary : COLORS.icon}
              size={14}
            />
            <MaterialIcons
              name="circle"
              color={registerStage === 2 ? COLORS.primary : COLORS.icon}
              size={14}
              style={{ marginHorizontal: rw(1.5) }}
            />
            <MaterialIcons
              name="circle"
              color={registerStage === 3 ? COLORS.primary : COLORS.icon}
              size={14}
            />
          </View>
          {isLoading ? (
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 'auto',
                width: rw(20),
                justifyContent: 'flex-end',
                paddingRight: rw(4),
              }}>
              <ActivityIndicator size="small" color={COLORS.borderLinkBtn} />
            </View>
          ) : (
            <Pressable
              hitSlop={7}
              onPress={completeRegister}
              disabled={!name && !birthday && !username ? true : false}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 'auto',
                marginLeft: 'auto',
                marginRight: rw(6),
              }}>
              <Text
                color={
                  !name || !birthday ? COLORS.textLight : COLORS.borderLinkBtn
                }>
                بعدی
              </Text>

              {!isLoading && (
                <Image
                  source={
                    !name || !birthday
                      ? require('../../../assets/icons/btns/disabled-next.png')
                      : require('../../../assets/icons/btns/enabled-next.png')
                  }
                  style={{ width: 25, height: 25, marginTop: rh(0.5) }}
                />
              )}
            </Pressable>
          )}
        </View>
        {showPictureModal && (
          <SelectPictureModal
            visible={showPictureModal}
            closeModal={() => setShowPictureModal(false)}
            openPicker={() => selectPicture()}
            openCamera={() => selectPicture(false, true)}
            openDefaultImages={onDefaultImagePress}
            removePic={() => setPicture(false)}
            showDelete={picture ? true : false}
          />
        )}
        {showBirthdayModal && (
          <SelectBirthDayModal
            visible={showBirthdayModal}
            closeModal={() => setShowBirthdayModal(false)}
            setBirthday={setBirthday}
          />
        )}
        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
  },
  nameInputContainer: {
    width: rw(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconContainer: {
    width: rw(24.8),
    height: rh(11.6),
    backgroundColor: COLORS.inputTabBarBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginVertical: rh(2),
  },
  birthdayContainer: {
    width: rw(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(1),
  },
  birthdayText: {
    width: rw(45),
    height: rh(4.5),
    borderRadius: 5,
    backgroundColor: COLORS.inputTabBarBg,
    justifyContent: 'center',
    paddingRight: rw(1),
    marginLeft: rw(1.5),
  },
  userIcon: {
    width: rw(22),
    height: rh(10.5),
    backgroundColor: COLORS.inputTabBarBg,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  plusIconContainer: {
    width: rw(8.5),
    height: rh(4),
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    top: rh(8),
  },
  calendarIconContainer: {
    width: rw(8.5),
    height: rh(4),
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    width: rw(100),
    marginVertical: rh(3),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default PersonalInfo;
