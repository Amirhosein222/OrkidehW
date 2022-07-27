/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HorizontalDatePicker from '@logisticinfotech/react-native-horizontal-date-picker';
import moment from 'moment-jalaali';
import FormData from 'form-data';
import Pushe from 'pushe-react-native';
import messaging from '@react-native-firebase/messaging';

import { RedTheme } from '../../components/homescreen';
import getWomanClient from '../../libs/api/womanApi';
import { getSettings, getWomanInfo } from '../../libs/apiCalls';
import { useIsPeriodDay, useApi } from '../../libs/hooks';
import {
  saveWomanRelations,
  WomanInfoContext,
  saveActiveRel,
} from '../../libs/context/womanInfoContext';
import getLoginClient from '../../libs/api/loginClientApi';
import {
  getFromAsyncStorage,
  showSnackbar,
  numberConverter,
  getDeviceId,
} from '../../libs/helpers';

import {
  Container,
  Divider,
  Text,
  Image,
  Header,
  Snackbar,
} from '../../components/common';

import { COLORS, STATUS_BAR_HEIGHT, rw, rh } from '../../configs';
import { TabActions } from '@react-navigation/native';

const HomeScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const isPeriodDay = useIsPeriodDay();
  const {
    saveFullInfo,
    handleUserPeriodDays,
    handleUserCalendar,
    settings,
    saveSettings,
  } = useContext(WomanInfoContext);
  const [setts, setSetts] = useApi(() => getSettings(''));
  const [adsSettings, setAdsSetting] = useState(
    settings ? settings.app_text_ads : null,
  );
  const [loginWomanInfo, setLoginWomanInfo] = useApi(() => getWomanInfo());
  const [pregnancy, setPregnancy] = useState(null);
  const [loadingPregnancy, setLoadingPregnancy] = useState(false);
  const [periodStart, setPeriodStart] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [fetching, setFetching] = useState(false);
  const womanInfo = useContext(WomanInfoContext);
  const [deviceId, setDeviceId] = useState(null);

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const getPregnancyPercent = async function (activeRel) {
    setLoadingPregnancy(true);
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('relation_id', activeRel);
    loginClient.post('formula/pregnancy', formData).then((response) => {
      setLoadingPregnancy(false);
      if (response.data.is_successful) {
        setPregnancy(response.data.data);
      } else {
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };

  const getCalendar = async function () {
    const womanClient = await getWomanClient();
    womanClient.get('show/calendar').then((response) => {
      if (response.data.is_successful) {
        const periodDays = response.data.data.filter(
          (d) => d.type === 'period',
        );
        handleUserCalendar(response.data.data);
        handleUserPeriodDays(periodDays);
      } else {
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      }
    });
  };

  const onDateSelected = async function (date) {
    if (fetching) {
      return 1;
    }
    date === 'today' && setFetching(true);
    const selectedDate =
      date === 'today' ? moment().locale('en').format('jYYYY/jMM/jDD') : date;
    const womanClient = await getWomanClient();
    const formData = new FormData();
    formData.append('date', selectedDate);
    womanClient.post('store/period/auto', formData).then((response) => {
      setFetching(false);
      if (response.data.is_successful) {
        AsyncStorage.setItem('periodStart', selectedDate);
        if (response.data.data.status === 'auto_s') {
          showSnackbar('تاریخ شروع دوره پریود شما با موفقیت ثبت شد', 'success');
          navigation.dispatch(
            TabActions.jumpTo('Calendar', { updateCal: true }),
          );
        } else if (response.data.data.status === 'auto_e') {
          showSnackbar('تاریخ پایان دوره پریود با موفقیت ثبت شد', 'success');
          navigation.dispatch(
            TabActions.jumpTo('Calendar', { updateCal: true }),
          );
        }
      } else {
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };

  const getRelations = async function () {
    const lastActiveRel = await AsyncStorage.getItem('lastActiveRelId');
    const loginClient = await getLoginClient();
    loginClient
      .get('index/relation?include_man=1&include_woman=1&gender=woman')
      .then((response) => {
        let rels = [];
        let activeRel = null;
        if (response.data.is_successful) {
          if (response.data.data.length === 0) {
            getPregnancyPercent(1);
            return;
          }
          response.data.data.map((rel) => {
            rels.push({
              label: rel.man_name ? rel.man_name : 'بدون نام',
              value: rel.id,
              is_active: rel.is_active,
              is_verified: rel.is_verified,
            });
            if (rel.is_active === 1 && rel.id === Number(lastActiveRel)) {
              activeRel = rel;
            }
          });
          if (activeRel) {
            saveActiveRel({
              relId: activeRel.id,
              label: activeRel.man_name,
              image: activeRel.man_image,
              mobile: activeRel.man.mobile,
            });
          }
          AsyncStorage.setItem('rels', JSON.stringify(rels));
          saveWomanRelations(rels);
        } else {
          showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
        }
      });
  };

  const sendFcmToken = async function () {
    Pushe.getDeviceId().then((dId) => {
      messaging()
        .getToken()
        .then(async (token) => {
          const formData = new FormData();
          formData.append('device_id', 'c9ea70d723ba8302');
          formData.append(
            'token',
            'fhduacvqeWfGP45TAUQIXq:APA91bHKPI1lTIfj5TNcZ_nnrkEaX_BOksnNNz9Ak3bHjBtViimnsarOw9GR7Nm2urt7VqGurVNczdXbV5NmDBJVS5zKiXY7IoYSDG37k-sJWO-o-zuwdlnRfHaJWTP2Td5eGJIqHKEr',
          );
          formData.append('gender', 'woman');
          const loginClient = await getLoginClient();
          loginClient
            .post('fcm/token/store', formData)
            .then((response) => {
              if (response.data.is_successful) {
                AsyncStorage.setItem('fcmTokenSent', 'true');
              }
            })
            .catch((e) => {
              console.log(e.response.data);
            });
        });
    });
  };

  useEffect(() => {
    getRelations();
    getCalendar();
  }, []);

  useEffect(() => {
    getFromAsyncStorage('periodStart').then((res) => {
      if (res) {
        const convertedDate = moment(res, 'jYYYY/jM/jD')
          .locale('en')
          .format('YYYY-MM-DD');
        setPeriodStart(new Date(convertedDate));
      } else {
        setPeriodStart('notSelected');
      }
    });
    getFromAsyncStorage('fcmTokenSent').then((res) => {
      if (res) {
        // already sent
      } else {
        sendFcmToken();
      }
    });
  }, []);

  useEffect(() => {
    if (womanInfo.activeRel) {
      getPregnancyPercent(womanInfo.activeRel.relId);
    } else {
      getPregnancyPercent();
    }
  }, [womanInfo.activeRel]);

  useEffect(() => {
    !settings && setSetts();
    getFromAsyncStorage('fcmTokenSent').then((res) => {
      if (!res) {
        sendFcmToken();
      }
    });
    getFromAsyncStorage('fullInfo').then((res) => {
      if (res) {
        saveFullInfo(JSON.parse(res));
      }
    });
  }, []);

  useEffect(() => {
    if (setts.data && setts.data.is_successful) {
      const result = setts.data.data.find((e) => e.key === 'app_text_ads');
      result && setAdsSetting(result);
      const settingsObj = setts.data.data.reduce(
        (acc, cur) => ({ ...acc, [cur.key]: cur }),
        {},
      );
      saveSettings(settingsObj);
    }
  }, [setts]);

  useEffect(() => {
    if (params.refresh === 'true') {
      setLoginWomanInfo();
    }
  }, [params]);

  useEffect(() => {
    if (loginWomanInfo.data && loginWomanInfo.data.is_successful) {
      saveFullInfo(loginWomanInfo.data.data[0]);
      AsyncStorage.setItem(
        'fullInfo',
        JSON.stringify(loginWomanInfo.data.data[0]),
      );
    }
  }, [loginWomanInfo]);

  if (isPeriodDay) {
    return (
      <RedTheme
        route={route}
        navigation={navigation}
        data={{
          pregnancy: pregnancy,
          loadingPregnancy: loadingPregnancy,
          adsSettings: adsSettings,
          periodStart: periodStart,
        }}
      />
    );
  }
  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <>
        <Header
          navigation={navigation}
          style={{ marginTop: STATUS_BAR_HEIGHT + rh(2) }}
        />
        <Divider color={COLORS.lightPink} width="90%" />
      </>

      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            paddingHorizontal: rw(6),
          }}>
          <Text
            small
            marginBottom={rh(1)}
            textAlign="right"
            marginTop={rh(1)}
            marginRight={rw(1)}
            color={COLORS.grey}>
            {/* {adsSettings && adsSettings.value} */}
            متن تست تبلیغات متن تست تبلیغات متن تست تبلیغات
          </Text>
        </View>

        <View
          style={{
            ...styles.pickerHeartContainer,
          }}>
          <View>
            {periodStart ? (
              <HorizontalDatePicker
                pickerType={'date'}
                onDateSelected={(date) => onDateSelected(date)}
                minDate={new Date(Date.now() - 12096e5)}
                maxDate={new Date()}
                dayFormat="jDD"
                monthFormat="jMMMM"
                isShowYear={false}
                returnDateFormat={'jYYYY/jMM/jDD'}
                datePickerContainerStyle={{
                  backgroundColor: 'white',
                  width: rw(100),
                }}
                selectedTextStyle={styles.selectedDate}
                unSelectedTextStyle={styles.unselectedDate}
                isPeriodDay={isPeriodDay}
                defaultSelected={
                  periodStart && periodStart !== 'notSelected'
                    ? periodStart
                    : null
                }
              />
            ) : (
              <ActivityIndicator size="large" color="red" />
            )}
          </View>
        </View>
      </View>

      <View style={styles.pregnancyContainer}>
        <Image
          imageSource={require('../../assets/images/500.png')}
          width={rw(90)}
          height={rh(46)}
        />
        {!loadingPregnancy ? (
          <View style={styles.pregnancyPercentText}>
            <Text bold xl color={COLORS.white}>
              {pregnancy && numberConverter(pregnancy)}
            </Text>
            <Text medium color={COLORS.white}>
              احتمال بارداری
            </Text>
          </View>
        ) : (
          <View style={styles.pregnancyPercentText}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>

      <Pressable onPress={() => onDateSelected('today')} disabled={fetching}>
        {fetching ? (
          <ActivityIndicator size="large" color={COLORS.pink} />
        ) : (
          <Image
            imageSource={require('../../assets/images/611.png')}
            width="95px"
            height="70px"
          />
        )}
      </Pressable>

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pregnancyContainer: {
    height: '55%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerHeartContainer: {
    width: rw(95),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  pregnancyPercentText: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: rh(5),
  },
  selectedDate: {
    fontFamily: 'Vazir',
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
  },
  unselectedDate: {
    fontFamily: 'Vazir',
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.dark,
  },
});

export default HomeScreen;
