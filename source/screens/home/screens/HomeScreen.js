/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Image,
  StatusBar,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-jalaali';

import { Pregnancy } from '../components';
import CalendarModal from '../../calendar/components/calendarModal';

import {
  getCalendarApi,
  getPregnancyPercentApi,
  storePeriodAutoApi,
} from '../apis';
import { initPusher } from '../../../libs/helpers';
import {
  getSettings,
  getWomanInfo,
  getPusherUserId,
} from '../../../libs/apiCalls';
import { useIsPeriodDay, useApi } from '../../../libs/hooks';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { getFromAsyncStorage } from '../../../libs/helpers';

import {
  BackgroundView,
  Header,
  Snackbar,
  HDatePicker,
  ShowLovePopup,
} from '../../../components/common';

import { COLORS, STATUS_BAR_HEIGHT, rw, rh } from '../../../configs';

const HomeScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const isPeriodDay = useIsPeriodDay();
  const womanInfo = useContext(WomanInfoContext);
  const {
    saveFullInfo,
    handleUserPeriodDays,
    handleUserCalendar,
    settings,
    saveSettings,
    saveAllSettings,
  } = useContext(WomanInfoContext);

  const storePDate = useRef(null);

  const [adsSettings, setAdsSetting] = useState(
    settings ? settings.app_text_need_support : null,
  );
  const [pregnancy, setPregnancy] = useState(null);
  const [periodStart, setPeriodStart] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showLove, setShowLove] = useState(false);

  const [loginWomanInfo, setLoginWomanInfo] = useApi(() => getWomanInfo());
  const [getCalendar, setGetCalendar] = useApi(() => getCalendarApi());
  const [getPregnancy, setGetPregnancy] = useApi(() =>
    getPregnancyPercentApi(
      womanInfo.activeRel
        ? womanInfo.activeRel.relId
        : !womanInfo.relations.length
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

  const handlePusherInit = async () => {
    initPusher(pusher.data.pusher_user_id, pusher.data.token);
  };

  useEffect(() => {
    onGetCalendar();
  }, []);

  useEffect(() => {
    getFromAsyncStorage('periodStart').then(res => {
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
    setLoginWomanInfo();
    setPusher();
  }, []);

  useEffect(() => {
    if (pusher.data) {
      handlePusherInit();
    }
  }, [pusher]);

  useEffect(() => {
    if (setts.data && setts.data.is_successful) {
      const result = setts.data.data.find(
        e => e.key === 'app_text_need_support',
      );
      result && setAdsSetting(result);
      const settingsObj = setts.data.data.reduce(
        (acc, cur) => ({ ...acc, [cur.key]: cur }),
        {},
      );
      saveSettings(settingsObj);
      saveAllSettings(setts.data.data);
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
    }
  }, [loginWomanInfo]);

  useEffect(() => {
    if (getCalendar.data && getCalendar.data.is_successful) {
      const periodDays = getCalendar.data.data.filter(d => d.type === 'period');
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
    womanInfo.getAndHandleRels();
  }, []);

  useEffect(() => {
    if (getPregnancy.data && getPregnancy.data.is_successful) {
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
      onGetCalendar();
      setSnackbar({
        msg: 'تاریخ شروع دوره پریود شما با موفقیت ثبت شد',
        visible: true,
        type: 'success',
      });
      // setShowCalendarModal(true);
    }
    storePeriodAuto.data &&
      !storePeriodAuto.data.is_successful &&
      setSnackbar({
        msg: JSON.stringify(
          storePeriodAuto.data.message[0].period_message
            ? storePeriodAuto.data.message[0].period_message
            : storePeriodAuto.data.message[0].cycle_message
            ? storePeriodAuto.data.message[0].cycle_message
            : 'خطا در ثبت روز پریود!',
        ),
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
        setShowLovePopup={setShowLove}
        setSnackbar={setSnackbar}
        ads={adsSettings && adsSettings.value}
      />

      <View style={{ alignItems: 'center', marginTop: rh(2) }}>
        {/* <View
          style={{
            paddingHorizontal: rw(6),
          }}>
          <Text
            marginBottom={rh(1.5)}
            textAlign="right"
            medium
            color={COLORS.textLight}>
            {adsSettings && adsSettings.value}
          </Text>
        </View> */}
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
        style={{ marginTop: rh(2) }}
        disabled={storePeriodAuto.isFetching}>
        {storePeriodAuto.isFetching ? (
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
            style={{ marginTop: rh(4) }}
          />
        ) : (
          <Image
            source={
              isPeriodDay
                ? require('../../../assets/icons/home/period.png')
                : require('../../../assets/icons/home/not-period.png')
            }
            style={{
              width: rw(28),
              height: rh(14),
            }}
            resizeMode="contain"
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
      {showLove ? (
        <ShowLovePopup handleVisible={() => setShowLove(false)} />
      ) : null}
    </BackgroundView>
  );
};

export default HomeScreen;
