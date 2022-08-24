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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HorizontalDatePicker from '@logisticinfotech/react-native-horizontal-date-picker';
import moment from 'moment-jalaali';
import FormData from 'form-data';

import { RedTheme } from '../../components/homescreen';
import { initPusher } from '../../libs/helpers';
import getWomanClient from '../../libs/api/womanApi';
import {
  getSettings,
  getWomanInfo,
  getPusherUserId,
} from '../../libs/apiCalls';
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
} from '../../libs/helpers';

import {
  BackgroundView,
  Container,
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
    fullInfo,
    handleUserPeriodDays,
    handleUserCalendar,
    settings,
    saveSettings,
  } = useContext(WomanInfoContext);
  const [setts, setSetts] = useApi(() => getSettings(''));
  const [pusher, setPusher] = useApi(() => getPusherUserId(''));

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
              birthday: activeRel.man.birth_date,
            });
          }
          AsyncStorage.setItem('rels', JSON.stringify(rels));
          saveWomanRelations(rels);
        } else {
          showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
        }
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
    getFromAsyncStorage('fullInfo').then((res) => {
      if (res) {
        saveFullInfo(JSON.parse(res));
      }
    });
    setPusher();
  }, []);

  useEffect(() => {
    if (pusher.data && pusher.data.is_successful && fullInfo) {
      // Set user token
      initPusher(pusher.data.pusher_user_id, pusher.data.token);
    }
  }, [pusher]);

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
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + rh(2) }}
      />

      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            paddingHorizontal: rw(6),
          }}>
          <Text
            marginBottom={rh(1.5)}
            textAlign="right"
            color={COLORS.textLight}>
            {/* {adsSettings && adsSettings.value} */}
            متن تست تبلیغات متن تست تبلیغات
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
                  backgroundColor: 'transparent',
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
            <Text large color={COLORS.white}>
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
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <Image
            imageSource={
              isPeriodDay
                ? require('../../assets/icons/home/period.png')
                : require('../../assets/icons/home/not-period.png')
            }
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
    </BackgroundView>
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
    fontFamily: 'Qs_Iranyekan_bold',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  unselectedDate: {
    fontFamily: 'Qs_Iranyekan_bold',
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.textLight,
  },
});

export default HomeScreen;
