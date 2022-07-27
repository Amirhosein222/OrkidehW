/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  LayoutAnimation,
  BackHandler,
  Keyboard,
} from 'react-native';
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment-jalaali';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome5';

import getLoginClient from '../../libs/api/loginClientApi';
import { getFromAsyncStorage, showSnackbar } from '../../libs/helpers';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

import { Text, TextInput, Snackbar } from '../common';
import { COLORS, WIDTH, months, days, getYears, rw, rh } from '../../configs';

const EnterName = ({
  setNameAndPicAndBirth,
  goToNextStage,
  editProfile,
  editName,
  editPass,
  navigation,
}) => {
  const { registerStep, handleRegisterStep, saveFullInfo } = useContext(
    WomanInfoContext,
  );

  const name = useRef();
  const [testName, setTestName] = useState('');
  const [picture, setPicture] = useState('');
  const [showBirthday, setShowBirthday] = useState(false);
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [info, setInfo] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const years = getYears();

  const handleTextInput = function (text) {
    name.current = text;
    setTestName(text);
  };
  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  // Set name and pic in the EnterInfo Screen as informations state.
  const handleNextStage = function () {
    if (!year || !month || !day) {
      setSnackbar({
        msg: 'لطفاتاریخ تولد را وارد کنید',
        visible: true,
      });
    } else {
      setNameAndPicAndBirth({
        name: testName,
        picture: picture,
        birthday: year + '/' + month + '/' + day,
      });
      goToNextStage(1);
    }
  };

  const handleBirthdayShow = function () {
    if (!testName) {
      setSnackbar({
        msg: 'لطفا نام خود را وارد کنید',
        visible: true,
      });
    } else {
      setShowBirthday(true);
    }
  };

  const selectPicture = function (remove = false) {
    if (remove) {
      setPicture(null);
      return;
    }
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then((image) => {
      setPicture(image);
      setSnackbar({
        msg: 'تصویر پروفایل با موفقیت انتخاب شد.',
        visible: true,
        type: 'success',
      });
    });
  };

  const updateName = async function () {
    if (testName) {
      const loginClient = await getLoginClient();
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('display_name', testName);
      formData.append(
        'birth_date',
        moment(info.birth_date).locale('en').format('jYYYY/jM/jD'),
      );
      formData.append('gender', 'woman');
      formData.append('is_password_active', Number(info.is_password_active));
      formData.append('is_finger_active', Number(info.is_finger_active));
      formData.append('password', editPass);
      formData.append('repeat_password', editPass);
      if (picture) {
        formData.append('image', {
          uri: picture.path,
          name: 'profileImg.png',
          type: 'image/png',
        });
      }
      loginClient
        .post('complete/profile', formData)
        .then((response) => {
          setIsUpdating(false);
          if (response.data.is_successful) {
            saveFullInfo(response.data.data);
            AsyncStorage.setItem(
              'fullInfo',
              JSON.stringify(response.data.data),
            );
            showSnackbar('اطلاعات شما با موفقیت ویرایش شد', 'success');
            navigation.goBack();
          } else {
            setSnackbar({
              msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
              visible: true,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setSnackbar({
        msg: 'لطفا نام را وارد کنید.',
        visible: true,
      });
    }
  };

  const handleBirhtday = function (value, type) {
    switch (type) {
      case 'days':
        setDay(value);
        break;
      case 'months':
        setMonth(value);
        break;
      case 'years':
        setYear(value);
        break;
      default:
        break;
    }
  };

  const handleSubmitEditing = () => {
    if (name.current) {
      handleLayoutAnimation();
      setIsNameEntered(true);
    }
  };

  const handleLayoutAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: { type: 'easeIn', property: 'scaleY' },
      update: { type: 'spring', springDamping: 0.9 },
      delete: { type: 'easeOut', property: 'scaleY' },
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
      if (showBirthday === true) {
        setShowBirthday(false);
        return true;
      }
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

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        handleSubmitEditing();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  if (showBirthday === true) {
    return (
      <View style={styles.content}>
        <Text large bold>
          تاریخ تولد
        </Text>
        <RNPickerSelect
          onValueChange={(value) => handleBirhtday(value, 'days')}
          items={days}
          placeholder={{ label: 'انتخاب روز', value: null }}
        />
        <View style={styles.selectedDate}>
          <Text>{day}</Text>
        </View>
        <RNPickerSelect
          onValueChange={(value) => handleBirhtday(value, 'months')}
          items={months}
          placeholder={{ label: 'انتخاب ماه', value: null }}
        />
        <View style={styles.selectedDate}>
          <Text>{month}</Text>
        </View>

        <RNPickerSelect
          onValueChange={(value) => handleBirhtday(value, 'years')}
          items={years}
          placeholder={{ label: 'انتخاب سال', value: null }}
        />
        <View style={styles.selectedDate}>
          <Text>{year}</Text>
        </View>

        <Button
          mode="contained"
          color={COLORS.pink}
          icon="chevron-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
          onPress={() => handleNextStage()}
          style={styles.btnNext}>
          <Text color="white">مرحله بعد</Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <View style={styles.nameInputContainer}>
        <Text medium bold>
          اسم قشنگت رو به ما میگی؟
        </Text>
        <TextInput
          onChangeText={handleTextInput}
          onSubmitEditing={handleSubmitEditing}
          multiline={false}
          style={{ marginTop: rh(3) }}
          placeholder="اسم"
          editedText={testName}
          textColor={COLORS.pink}
          phColor={COLORS.pink}
        />
        {isNameEntered && (
          <Text medium bold marginTop={rh(0.8)}>
            چه اسم قشنگی!
          </Text>
        )}
      </View>

      {picture ? (
        <Pressable
          onPress={() => selectPicture(true)}
          style={{ marginTop: 20, alignItems: 'center' }}>
          <Text color={COLORS.pink} medium>
            حذف تصویر پروفایل
          </Text>
          <View style={styles.userIcon}>
            <Image
              source={{ uri: picture.path }}
              style={{
                height: 90,
                width: 90,
              }}
            />
          </View>
        </Pressable>
      ) : (
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
            paddingHorizontal: rw(0),
          }}>
          <Text medium color={COLORS.dark} bold>
            مطمئنم عکست هم مثل اسمت قشنگه!
          </Text>
          <View style={{ paddingHorizontal: rw(15) }}>
            <Text medium color={COLORS.dark} bold>
              یه دونه از عکس های قشنگت رو اینجا برای پروفایل قرار بده.
            </Text>
          </View>

          <Pressable style={styles.userIcon} onPress={() => selectPicture()}>
            <Icon name="user-alt" size={40} color={COLORS.white} />
          </Pressable>
        </View>
      )}

      <Button
        mode="contained"
        color={COLORS.pink}
        icon="chevron-right"
        contentStyle={{ flexDirection: 'row-reverse' }}
        onPress={editProfile ? () => updateName() : () => handleBirthdayShow()}
        loading={isUpdating ? true : false}
        style={styles.btnNext}>
        {editProfile ? (
          <Text color="white">ثبت</Text>
        ) : (
          <Text color="white">مرحله بعد</Text>
        )}
      </Button>
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: 250,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    marginTop: 0,
    justifyContent: 'space-evenly',
  },
  nameInputContainer: {
    width: rw(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 89,
    height: 89,
    backgroundColor: COLORS.lightPink,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnDate: {
    width: '30%',
    height: 40,
    borderRadius: 5,
    elevation: 0,
    margin: 5,
  },
  btnNext: {
    width: '40%',
    height: 40,
    borderRadius: 40,
    elevation: 0,
    marginTop: rh(2),
  },
  pickerContainer: {
    backgroundColor: 'white',
    height: '75%',
    alignItems: 'center',
  },
  inputAndroid: {
    fontSize: 14,
    fontFamily: 'Vazir',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
  },
  selectedDate: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightPink,
    width: '30%',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default EnterName;
