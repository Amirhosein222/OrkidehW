/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect, useContext } from 'react';
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
import moment from 'moment-jalaali';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import SelectBirthDayModal from './SelectBirthDayModal';
import SelectPictureModal from './SelectPictureModal';
import { Text, Snackbar, InputRow } from '../common';

import getLoginClient from '../../libs/api/loginClientApi';
import { getFromAsyncStorage, showSnackbar } from '../../libs/helpers';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

import { COLORS, rw, rh } from '../../configs';

const PersonalInfo = ({
  goToNextStage,
  editProfile,
  editName,
  setNameAndPicAndBirth,
  navigation,
}) => {
  const { registerStage, saveFullInfo } = useContext(WomanInfoContext);
  const name = useRef();

  const [testName, setTestName] = useState('');
  const [username, setUsername] = useState('');
  const [family, setFamily] = useState('');
  const [picture, setPicture] = useState('');
  const [birthday, setBirthday] = useState('');
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameRequired, setNameRequired] = useState(false);
  const [birthdayRequired, setBirthdayRequired] = useState(null);
  const [info, setInfo] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleTextInput = function (text) {
    name.current = text;
    setTestName(text);
  };
  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const selectPicture = function (remove = false, camera = false) {
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
      }).then((image) => {
        setShowPictureModal(false);
        setPicture(image);
      });
    } else {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      }).then((image) => {
        setShowPictureModal(false);
        setPicture(image);
      });
    }
  };

  // const handleLayoutAnimation = () => {
  //   LayoutAnimation.configureNext({
  //     duration: 500,
  //     create: { type: 'easeIn', property: 'scaleY' },
  //     update: { type: 'spring', springDamping: 0.9 },
  //     delete: { type: 'easeOut', property: 'scaleY' },
  //   });
  // };

  // Set name and pic in the EnterInfo Screen as informations state.
  // const handleNextStage = function () {
  //   setNameAndPicAndBirth({
  //     name: testName,
  //     picture: picture,
  //     birthday: birthday,
  //   });
  //   goToNextStage(1);
  // };

  const completeRegister = async function () {
    const loginClient = await getLoginClient();
    setIsLoading(true);
    const formData = new FormData();
    if (picture) {
      formData.append('image', {
        uri: picture.path,
        type: `image/${picture.type}`,
        name: 'profileImg.' + picture.type,
      });
    }
    formData.append('display_name', testName);
    formData.append('birth_date', birthday);
    formData.append('is_password_active', 0);
    formData.append('is_finger_active', 0);
    formData.append('password', '');
    formData.append('repeat_password', '');
    formData.append('gender', 'woman');
    loginClient
      .post('complete/profile', formData)
      .then((response) => {
        setIsLoading(false);
        if (response.data.is_successful) {
          setNameAndPicAndBirth({
            name: testName,
          });
          AsyncStorage.setItem('fullInfo', JSON.stringify(response.data.data));
          goToNextStage(1);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است',
            visible: true,
          });
        }
      })
      .catch((e) => {
        // console.log(e);
      });
  };

  useEffect(() => {
    name.current = editName;
    setTestName(editName);
    getFromAsyncStorage('fullInfo').then((res) => {
      if (res) {
        setInfo(JSON.parse(res));
      }
    });
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
        <View style={{ marginTop: rh(1) }}>
          <Text large color={COLORS.textDark}>
            اطلاعات شخصی
          </Text>
        </View>
        <View style={styles.userIconContainer}>
          {picture ? (
            <Image
              source={{ uri: picture.path }}
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
            <Image
              source={require('../../assets/icons/btns/add-memories.png')}
              style={{ width: 20, height: 20 }}
            />
          </Pressable>
        </View>
        <InputRow
          title="نام کاربری :"
          placeholder="نام کاربری خود را اینجا وارد کنید"
          handleTextInput={setUsername}
          name="username"
        />
        <InputRow
          title="نام :"
          placeholder="نام خود را اینجا وارد کنید"
          handleTextInput={setTestName}
          name="name"
          required={!testName ? true : false}
          tipText="وارد کردن نام الزامی است"
        />
        <InputRow
          title="نام خانوادگی :"
          placeholder="نام خانوادگی خود را اینجا وارد کنید"
          handleTextInput={setFamily}
          name="familyName"
        />
        <View style={{ width: rw(100), alignItems: 'center' }}>
          <View style={styles.birthdayContainer}>
            <Pressable
              hitSlop={7}
              onPress={() => setShowBirthdayModal(true)}
              style={styles.calendarIconContainer}>
              <Image
                source={require('../../assets/icons/btns/white-calendar.png')}
                style={{ width: 25, height: 25 }}
              />
            </Pressable>
            <View style={styles.birthdayText}>
              <Text color={COLORS.textLight} bold alignSelf="flex-end">
                {birthday ? birthday : '----/--/--'}
              </Text>
            </View>
            <View style={{ width: rw(27) }}>
              <Text color={COLORS.textLight} bold alignSelf="flex-end">
                تاریخ تولد
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
              <Text color={COLORS.error} small alignSelf="flex-end">
                وارد کردن تاریخ تولد الزامی است
              </Text>
            </View>
          )}
        </View>

        <View style={styles.stepperContainer}>
          <View style={{ width: rw(20) }} />
          <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
            <MaterialIcons
              name="circle"
              color={registerStage === 0 ? COLORS.primary : COLORS.icon}
              size={14}
            />
            <MaterialIcons
              name="circle"
              color={registerStage === 1 ? COLORS.primary : COLORS.icon}
              size={14}
              style={{ marginHorizontal: rw(1.5) }}
            />
            <MaterialIcons
              name="circle"
              color={registerStage === 2 ? COLORS.primary : COLORS.icon}
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
              disabled={!testName && !birthday ? true : false}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 'auto',
                marginLeft: 'auto',
                marginRight: rw(6),
              }}>
              <Text
                color={
                  !testName || !birthday
                    ? COLORS.textLight
                    : COLORS.borderLinkBtn
                }>
                بعدی
              </Text>

              {!isLoading && (
                <Image
                  source={
                    !testName || !birthday
                      ? require('../../assets/icons/btns/disabled-next.png')
                      : require('../../assets/icons/btns/enabled-next.png')
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
            openCamera={() => selectPicture(true)}
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
    // overflow: 'hidden',
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
    marginBottom: rh(4),
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default PersonalInfo;
