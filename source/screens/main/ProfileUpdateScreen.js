/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-jalaali';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';

import { useFullInfo, useIsPeriodDay } from '../../libs/hooks';
import getLoginClient from '../../libs/api/loginClientApi';
import {
  getFromAsyncStorage,
  numberConverter,
  showSnackbar,
} from '../../libs/helpers';

import {
  Container,
  Text,
  Image,
  Divider,
  TextInput,
  Switch,
  TabBar,
  Snackbar,
} from '../../components/common';

import {
  COLORS,
  SCROLLVIEWCONTAINER,
  WIDTH,
  STATUS_BAR_HEIGHT,
  rw,
  rh,
} from '../../configs';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

const ProfileUpdateScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const fullInfo = useFullInfo();
  const { saveFullInfo } = useContext(WomanInfoContext);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [periodAlarms, setPeriodAlarms] = useState({
    notif: 0,
    sms: 0,
  });
  const [pmsAlarms, setPmsAlarms] = useState({
    notif: 0,
    sms: 0,
  });
  const [ovalAlarms, setOvalAlarms] = useState({
    notif: 0,
    sms: 0,
  });
  const [drugAlarms, setDrugAlarms] = useState({
    notif: 0,
    sms: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordActive, setPasswordActive] = useState(true);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [finger, setFinger] = useState(true);

  const handleAlarm = function (type, alarm, value) {
    switch (type) {
      case 'period_f':
        setPeriodAlarms({
          notif:
            alarm === 'notif' ? (value === true ? 1 : 0) : periodAlarms.notif,
          sms: alarm === 'sms' ? value : periodAlarms.sms,
        });
        AsyncStorage.setItem(
          'periodAlarms',
          JSON.stringify({
            notif: alarm === 'notif' ? value : periodAlarms.notif,
            sms: alarm === 'sms' ? value : periodAlarms.sms,
          }),
        );
        setAlarmSettings(
          type,
          alarm === 'sms'
            ? value === true
              ? 1
              : 0
            : periodAlarms.sms === true
            ? 1
            : 0,
          alarm === 'notif'
            ? value === true
              ? 1
              : 0
            : periodAlarms.notif === true
            ? 1
            : 0,
        );
        break;
      case 'pms_f':
        setPmsAlarms({
          notif: alarm === 'notif' ? value : pmsAlarms.notif,
          sms: alarm === 'sms' ? value : pmsAlarms.sms,
        });
        AsyncStorage.setItem(
          'pmsAlarms',
          JSON.stringify({
            notif: alarm === 'notif' ? value : pmsAlarms.notif,
            sms: alarm === 'sms' ? value : pmsAlarms.sms,
          }),
        );
        setAlarmSettings(
          type,
          alarm === 'sms'
            ? value === true
              ? 1
              : 0
            : pmsAlarms.sms === true
            ? 1
            : 0,
          alarm === 'notif'
            ? value === true
              ? 1
              : 0
            : pmsAlarms.notif === true
            ? 1
            : 0,
        );
        break;
      // case 'ovulation_f':
      //   setOvalAlarms({
      //     notif: alarm === 'notif' ? value : ovalAlarms.notif,
      //     sms: alarm === 'sms' ? value : ovalAlarms.sms,
      //   });
      //   AsyncStorage.setItem(
      //     'ovalAlarms',
      //     JSON.stringify({
      //       notif: alarm === 'notif' ? value : ovalAlarms.notif,
      //       sms: alarm === 'sms' ? value : ovalAlarms.sms,
      //     }),
      //   );
      //   ovalAlarm = alarm;
      //   setAlarmSettings(
      //     type,
      //     ovalAlarm === 'sms' ? 1 : 0,
      //     ovalAlarm === 'notif' ? 1 : 0,
      //   );
      //   break;
      // case 'drug':
      //   setDrugAlarms({
      //     notif: alarm === 'notif' ? value : drugAlarms.notif,
      //     sms: alarm === 'sms' ? value : drugAlarms.sms,
      //   });
      //   AsyncStorage.setItem(
      //     'drugAlarms',
      //     JSON.stringify({
      //       notif: alarm === 'notif' ? value : drugAlarms.notif,
      //       sms: alarm === 'sms' ? value : drugAlarms.sms,
      //     }),
      //   );
      //   drugAlarm = alarm;
      //   setAlarmSettings(
      //     type,
      //     drugAlarm === 'sms' ? 1 : 0,
      //     drugAlarm === 'notif' ? 1 : 0,
      //   );
      //   break;
      default:
        break;
    }
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const setAlarmSettings = async function (type, sms, notif) {
    const loginClient = await getLoginClient();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('send_sms', sms);
    formData.append('send_notif', notif);
    formData.append('type', type);
    formData.append('gender', 'woman');
    loginClient.post('alarm/setting/update', formData).then((response) => {
      setIsLoading(false);
      if (response.data.is_successful) {
        showSnackbar('تغییرات با موفقیت اعمال شد.', 'success');
      } else {
        showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید', 'error');
      }
    });
  };

  const handleDefaultSettings = function (setting) {
    getFromAsyncStorage('periodAlarms').then((res) => {
      if (res) {
        const parsedInfo = JSON.parse(res);
        setPeriodAlarms(parsedInfo);
      }
    });
    getFromAsyncStorage('pmsAlarms').then((res) => {
      if (res) {
        const parsedInfo = JSON.parse(res);
        setPmsAlarms(parsedInfo);
      }
    });
    getFromAsyncStorage('ovalAlarms').then((res) => {
      if (res) {
        const parsedInfo = JSON.parse(res);
        setOvalAlarms(parsedInfo);
      }
    });
    getFromAsyncStorage('drugAlarms').then((res) => {
      if (res) {
        const parsedInfo = JSON.parse(res);
        setDrugAlarms(parsedInfo);
      }
    });
  };

  const validate = function () {
    if (passwordActive === true && finger === true) {
      setSnackbar({
        msg: 'فعال کردن حداقل یکی از روش ها برای ورود به سیستم الزامی است!',
        visible: true,
      });
      return false;
    }
    if (passwordActive === false && password === '' && rePassword === '') {
      setSnackbar({
        msg: 'لطفا رمز عبور را وارد کنید.',
        visible: true,
      });
      return false;
    }
    if (password !== rePassword) {
      setSnackbar({
        msg: 'رمز عبور، با تکرار آن مطابقت ندارد!',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const updatePass = async function () {
    if (validate()) {
      const loginClient = await getLoginClient();
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('display_name', fullInfo.display_name);
      formData.append('password', password);
      formData.append('repeat_password', rePassword);
      formData.append(
        'birth_date',
        moment(fullInfo.birth_date).locale('en').format('jYYYY/jM/jD'),
      );
      formData.append('gender', 'woman');
      formData.append(
        'is_password_active',
        Number(fullInfo.is_password_active),
      );
      formData.append('is_finger_active', Number(fullInfo.is_finger_active));

      loginClient
        .post('complete/profile', formData)
        .then((response) => {
          setIsUpdating(false);
          if (response.data.is_successful) {
            setPassword('');
            setRePassword('');
            showSnackbar('رمز عبور شما با موفقیت تغییر کرد', 'success');
            saveFullInfo(JSON.parse(response.data.data));
            AsyncStorage.setItem(
              'fullInfo',
              JSON.stringify(response.data.data),
            );
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
    }
  };

  const handleTextInput = function (text, type) {
    if (type === 'password') {
      setPassword(text);
    } else {
      setRePassword(text);
    }
  };

  const shareCode = function () {
    Share.open({ message: fullInfo.regent_self, title: 'اشتراک گذاری کد شما' })
      .then((res) => {})
      .catch((err) => {
        err && console.log(err);
      });
  };

  const copyToClipboard = () => {
    Clipboard.setString(fullInfo.regent_self);
    setSnackbar({
      msg: 'کد شما کپی شد.',
      visible: true,
      type: 'success',
    });
  };

  useEffect(() => {
    setFinger(fullInfo.is_password_active === '0' ? true : false);
    setPasswordActive(fullInfo.is_finger_active === '0' ? true : false);
    handleDefaultSettings();
  }, []);

  return (
    <KeyboardAwareScrollView>
      <Container justifyContent="flex-start">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ScrollView
          style={{ width: '100%', marginTop: STATUS_BAR_HEIGHT + 5 }}
          contentContainerStyle={SCROLLVIEWCONTAINER}>
          <View style={styles.header}>
            <Pressable onPress={() => shareCode()}>
              <Image
                imageSource={require('../../assets/images/share.png')}
                width="27px"
                height="27px"
                marginLeft={rw(3)}
              />
            </Pressable>

            <Pressable
              onPress={() => navigation.openDrawer()}
              style={{ alignSelf: 'flex-end' }}>
              <MaterialCommunityIcons
                name="menu"
                color={COLORS.grey}
                size={28}
                style={{ marginRight: rw(2.8) }}
              />
            </Pressable>
          </View>

          <Divider
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            width="90%"
            style={styles.divider}
          />

          <View style={styles.regentCodeContainer}>
            <View style={styles.clipboardContainer}>
              <Pressable onPress={() => copyToClipboard()} hitSlop={7}>
                <Image
                  imageSource={require('../../assets/images/copy.png')}
                  width="18px"
                  height="22px"
                  marginRight="10px"
                />
              </Pressable>
              {fullInfo.regent_self && (
                <Text bold medium>
                  {numberConverter(fullInfo.regent_self)}
                </Text>
              )}
            </View>
            <Text medium bold>
              کد شما برای معرفی به دیگران :{' '}
            </Text>
          </View>

          <Text small marginTop={rh(3)}>
            رمز عبور برای ورود به سیستم
          </Text>

          <Switch active={passwordActive} changeStatus={setPasswordActive} />

          <View style={{ justifyContent: 'center', marginBottom: rh(1) }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: rh(1),
              }}>
              <TextInput
                placeholder="رمز عبور جدید را وارد کنید"
                style={styles.passInput}
                phColor={COLORS.grey}
                onChangeText={handleTextInput}
                editedText={password}
                inputName="password"
                secureTextEntry={true}
              />
              <View style={{ width: '20%', justifyContent: 'center' }}>
                <Text small alignSelf="flex-end">
                  رمز عبور
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TextInput
                placeholder="تایید رمز عبور"
                style={styles.passInput}
                phColor={COLORS.grey}
                onChangeText={handleTextInput}
                editedText={rePassword}
                inputName="rePass"
                secureTextEntry={true}
              />
              <View style={{ width: '20%', justifyContent: 'center' }}>
                <Text small alignSelf="flex-end">
                  تایید رمز عبور
                </Text>
              </View>
            </View>
          </View>

          <Button
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            mode="contained"
            style={[styles.btn, { marginTop: 0 }]}
            loading={isUpdating ? true : false}
            onPress={() => updatePass()}>
            <Text color="white">تغییر رمز عبور</Text>
          </Button>
          <Text small marginTop={rh(3)}>
            فعالسازی اثر انگشت برای ورود به سیستم
          </Text>

          <Switch active={finger} changeStatus={setFinger} />
          <Button
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            mode="contained"
            style={{ ...styles.btn, marginTop: rh(5) }}
            onPress={() =>
              navigation.navigate('Register', { editNumber: true })
            }>
            <Text color="white">تغییر شماره تلفن</Text>
          </Button>
          <Button
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            mode="contained"
            style={styles.btn}
            onPress={() =>
              navigation.navigate('EnterInfo', {
                editProfile: true,
                name: fullInfo.display_name,
                pass: fullInfo.password,
              })
            }>
            <Text color="white">ویرایش پروفایل</Text>
          </Button>
          <Button
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            mode="contained"
            style={{ ...styles.btn, marginBottom: rh(2) }}
            onPress={() => navigation.navigate('ContactSpouse')}>
            <Text color="white">ارتباط با همسر</Text>
          </Button>
          {/* <Button
          color={COLORS.pink}
          mode="contained"
          style={styles.btn}
          onPress={() => navigation.navigate('SetAlarm')}>
          <Text color="white">تنظیم هشدار</Text>
        </Button>
        <Button color={COLORS.pink} mode="contained" style={styles.btn}>
          <Text color="white">انتخاب پس زمینه</Text>
        </Button> */}
          <Divider
            color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            width="90%"
            style={styles.divider}
          />
          <Text bold marginTop={rh(2)}>
            یادآوری ها
          </Text>

          <View style={styles.remindersContainer}>
            <Text marginLeft="10" small>
              پیامک
            </Text>
            <Text small>یادآوری از طریق ارکیده</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.checkBox}>
              <Checkbox
                disabled={isLoading ? true : false}
                status={periodAlarms.sms ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleAlarm('period_f', 'sms', !periodAlarms.sms);
                }}
              />
            </View>

            <View style={{ ...styles.checkBox, marginRight: rw(3) }}>
              <Checkbox
                disabled={isLoading ? true : false}
                status={periodAlarms.notif ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleAlarm('period_f', 'notif', !periodAlarms.notif);
                }}
              />
            </View>
            <Text small>یادآوری ها چند روز قبل از قاعدگی</Text>
          </View>
          <View style={{ ...styles.row, marginBottom: rh(1) }}>
            <View style={styles.checkBox}>
              <Checkbox
                disabled={isLoading ? true : false}
                status={pmsAlarms.sms ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleAlarm('pms_f', 'sms', !pmsAlarms.sms);
                }}
              />
            </View>

            <View style={styles.checkBox}>
              <Checkbox
                disabled={isLoading ? true : false}
                status={pmsAlarms.notif ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleAlarm('pms_f', 'notif', !pmsAlarms.notif);
                }}
              />
            </View>
            <Text small>یادآوری ها چند روز قبل از پی ام اس</Text>
          </View>
          {/* <RowContainer justifyContent="space-between">
          <View style={styles.checkBox}>
            <Checkbox
              status={ovalAlarms.sms ? 'checked' : 'unchecked'}
              onPress={() => {
                handleAlarm('ovulation_f', 'sms', !ovalAlarms.sms);
              }}
            />
          </View>

          <View style={styles.checkBox}>
            <Checkbox
              status={ovalAlarms.notif ? 'checked' : 'unchecked'}
              onPress={() => {
                handleAlarm('ovulation_f', 'notif', !ovalAlarms.notif);
              }}
              style={{ marginLeft: 20, width: 200 }}
            />
          </View>
          <Text small>یادآوری ها چند روز قبل از تخمک گذاری</Text>
        </RowContainer> */}
          {/* <RowContainer justifyContent="space-between">
          <Checkbox
            status={drugAlarms.sms ? 'checked' : 'unchecked'}
            onPress={() => {
              handleAlarm('drug', 'sms', !drugAlarms.sms);
            }}
          />
          <Checkbox
            status={drugAlarms.notif ? 'checked' : 'unchecked'}
            onPress={() => {
              handleAlarm('drug', 'notif', !drugAlarms.notif);
            }}
          />
          <Text small>یادآوری ها چند روز قبل از قرص</Text>
        </RowContainer> */}
        </ScrollView>
        <TabBar seperate={true} navigation={navigation} />
        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </Container>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: rw(95),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: rh(2),
    paddingTop: rh(2),
    paddingHorizontal: rw(0),
  },
  image: {
    width: WIDTH,
    height: 250,
  },
  passInput: {
    borderRadius: 40,
    height: 45,
    width: rw(62),
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
    borderWidth: 1,
    margin: 5,
    color: COLORS.grey,
  },
  divider: {
    alignSelf: 'center',
  },
  checkBox: {
    alignItems: 'center',
  },
  btn: {
    width: '45%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    margin: 10,
    alignSelf: 'center',
  },
  remindersContainer: {
    flexDirection: 'row',
    width: rw(50),
    justifyContent: 'space-evenly',
    marginTop: rh(2),
  },
  row: {
    flexDirection: 'row',
    width: rw(95),
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: rh(2),
    paddingLeft: rh(2),
    marginTop: rh(1),
  },
  regentCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: rh(2),
  },
  clipboardContainer: {
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: rh(0.5),
    paddingHorizontal: rh(1),
    borderRadius: 5,
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ProfileUpdateScreen;
