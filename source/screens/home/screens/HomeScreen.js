/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StatusBar, ActivityIndicator, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-jalaali';

import { Pregnancy } from '../components';
import CalendarModal from '../../../components/calendar';

import {
  getCalendarApi,
  getPregnancyPercentApi,
  storePeriodAutoApi,
  getRelationsApi,
} from '../apis';
import { initPusher } from '../../../libs/helpers';
import {
  getSettings,
  getWomanInfo,
  getPusherUserId,
} from '../../../libs/apiCalls';
import { useIsPeriodDay, useApi } from '../../../libs/hooks';
import {
  saveWomanRelations,
  WomanInfoContext,
  saveActiveRel,
} from '../../../libs/context/womanInfoContext';
import { getFromAsyncStorage, showSnackbar } from '../../../libs/helpers';

import {
  BackgroundView,
  Text,
  Image,
  Header,
  Snackbar,
  HDatePicker,
} from '../../../components/common';

import { COLORS, STATUS_BAR_HEIGHT, rw, rh } from '../../../configs';

const HomeScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const isPeriodDay = useIsPeriodDay();
  const womanInfo = useContext(WomanInfoContext);
  const {
    saveFullInfo,
    fullInfo,
    handleUserPeriodDays,
    handleUserCalendar,
    settings,
    saveSettings,
  } = useContext(WomanInfoContext);

  const storePDate = useRef(null);

  const [adsSettings, setAdsSetting] = useState(
    settings ? settings.app_text_ads : null,
  );
  const [pregnancy, setPregnancy] = useState(null);
  const [periodStart, setPeriodStart] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const [loginWomanInfo, setLoginWomanInfo] = useApi(() => getWomanInfo());
  const [getCalendar, setGetCalendar] = useApi(() => getCalendarApi());
  const [getRelations, setGetRelations] = useApi(() => getRelationsApi());
  const [getPregnancy, setGetPregnancy] = useApi(() =>
    getPregnancyPercentApi(
      womanInfo.activeRel
        ? womanInfo.activeRel.relId
        : getRelations.data && !getRelations.data.data.length
        ? 1
        : '',
    ),
  );
  const [storePeriodAuto, setStorePeriodAuto] = useApi(() =>
    storePeriodAutoApi(storePDate.current),
  );
  const [setts, setSetts] = useApi(() => getSettings(''));
  const [pusher, setPusher] = useApi(() => getPusherUserId(''));

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onGetPregnancyPercent = async function () {
    setGetPregnancy();
  };

  const onGetCalendar = async function () {
    setGetCalendar();
  };

  const onStorePeriodAuto = async function (date) {
    const selectedDate =
      date === 'today' ? moment().locale('en').format('jYYYY/jMM/jDD') : date;
    storePDate.current = selectedDate;
    setStorePeriodAuto();
  };

  const onGetRelations = async function () {
    setGetRelations();
  };

  const handlePusherInit = () => {
    getFromAsyncStorage('pusherUid')
      .then(async (res) => {
        if (!res) {
          initPusher(pusher.data.pusher_user_id, pusher.data.token);
          await AsyncStorage.setItem('pusherUid', pusher.data.pusher_user_id);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    onGetRelations();
    onGetCalendar();
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
    onGetPregnancyPercent();
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
    if (pusher.data && fullInfo) {
      handlePusherInit();
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

  useEffect(() => {
    if (getCalendar.data && getCalendar.data.is_successful) {
      const periodDays = getCalendar.data.data.filter(
        (d) => d.type === 'period',
      );
      handleUserCalendar(getCalendar.data.data);
      handleUserPeriodDays(periodDays);
    }
    getCalendar.data &&
      !getCalendar.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [getCalendar]);

  useEffect(() => {
    if (getRelations.data && getRelations.data.is_successful) {
      const lastActiveRel = AsyncStorage.getItem('lastActiveRelId');

      let rels = [];
      let activeRel = null;
      if (getRelations.data.data.length === 0) {
        onGetPregnancyPercent();
        return;
      }
      getRelations.data.data.map((rel) => {
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
    }
    getRelations.data &&
      !getRelations.data.is_successful &&
      showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
  }, [getRelations]);

  useEffect(() => {
    if (getPregnancy.data && getPregnancy.data.is_successful) {
      console.log('preg res ', getPregnancy.data);
      setPregnancy(getPregnancy.data.data);
    }
    getPregnancy.data &&
      !getPregnancy.data.is_successful &&
      setSnackbar({
        msg: getPregnancy.data.message,
        visible: true,
      });
  }, [getPregnancy]);

  useEffect(() => {
    if (storePeriodAuto.data && storePeriodAuto.data.is_successful) {
      AsyncStorage.setItem('periodStart', storePDate.current);
      if (storePeriodAuto.data.data.status === 'auto_s') {
        showSnackbar('تاریخ شروع دوره پریود شما با موفقیت ثبت شد', 'success');
        setShowCalendarModal(true);
      } else if (storePeriodAuto.data.data.status === 'auto_e') {
        showSnackbar('تاریخ پایان دوره پریود با موفقیت ثبت شد', 'success');
        setShowCalendarModal(true);
      }
    }
    storePeriodAuto.data &&
      !storePeriodAuto.data.is_successful &&
      setSnackbar({
        msg: storePeriodAuto.data.message,
        visible: true,
      });
  }, [storePeriodAuto]);

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
        <HDatePicker
          periodStart={periodStart}
          onDateSelected={onStorePeriodAuto}
          isFetching={storePeriodAuto.isFetching}
        />
      </View>

      <Pregnancy
        pregnancy={pregnancy}
        isFetching={getPregnancy.isFetching ? true : false}
      />

      <Pressable
        onPress={() => onStorePeriodAuto('today')}
        style={{ marginTop: rh(4) }}
        disabled={storePeriodAuto.isFetching}>
        {storePeriodAuto.isFetching ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <Image
            imageSource={
              isPeriodDay
                ? require('../../../assets/icons/home/period.png')
                : require('../../../assets/icons/home/not-period.png')
            }
            width="95px"
            height="70px"
          />
        )}
      </Pressable>

      {showCalendarModal && (
        <CalendarModal
          visible={showCalendarModal}
          closeModal={() => setShowCalendarModal(false)}
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

export default HomeScreen;
