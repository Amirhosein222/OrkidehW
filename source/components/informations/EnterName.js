/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Pressable, Image, BackHandler } from 'react-native';
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
  const { registerStep, handleRegisterStep } = useContext(WomanInfoContext);

  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [showBirthday, setShowBirthday] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [info, setInfo] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const years = getYears();

  const handleTextInput = function (text) {
    setName(text);
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
        name: name,
        picture: picture,
        birthday: year + '/' + month + '/' + day,
      });
      goToNextStage(1);
    }
  };

  const handleBirthdayShow = function () {
    if (!name) {
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
      width: 300,
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
    if (name) {
      const loginClient = await getLoginClient();
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('display_name', name);
      formData.append(
        'birth_date',
        moment(info.birth_date).locale('en').format('jYYYY/jM/jD'),
      );
      formData.append('gender', 'woman');
      formData.append('is_password_active', Number(info.is_password_active));
      formData.append('is_finger_active', Number(info.is_finger_active));
      formData.append('password', editPass);
      formData.append('repeat_password', editPass);
      formData.append('image', {
        uri: picture.path,
        type: `image/${picture.type}`,
        name: 'profileImg.' + picture.type,
      });
      console.log('form Data ', formData);
      loginClient
        .post('complete/profile', formData)
        .then((response) => {
          setIsUpdating(false);
          if (response.data.is_successful) {
            showSnackbar('نام شما با موفقیت تغییر کرد', 'success');
            AsyncStorage.setItem(
              'fullInfo',
              JSON.stringify(response.data.data),
            );
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

  useEffect(() => {
    setName(editName);
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
        setName('');
        return true;
      }
      if (editProfile === true) {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

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
        <Text large bold>
          نام نمایشی شما
        </Text>
        <TextInput
          onChangeText={handleTextInput}
          style={{ marginTop: rh(3) }}
          placeholder="نام نمایشی شما"
          editedText={name}
          textColor={COLORS.pink}
          phColor={COLORS.pink}
        />
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
        <Pressable
          onPress={() => selectPicture()}
          style={{ marginTop: 20, alignItems: 'center' }}>
          <Text color={COLORS.dark} medium>
            انتخاب تصویر پروفایل
          </Text>
          <View style={styles.userIcon}>
            <Icon name="user-alt" size={40} color={COLORS.white} />
          </View>
        </Pressable>
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
