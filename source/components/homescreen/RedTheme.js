/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import getWomanClient from '../../libs/api/womanApi';
import { useIsPeriodDay } from '../../libs/hooks';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { showSnackbar, numberConverter } from '../../libs/helpers';

import { Container, Text, Image, Snackbar } from '../../components/common';

import { COLORS, STATUS_BAR_HEIGHT, rw, rh } from '../../configs';
import { TabActions } from '@react-navigation/native';

const RedTheme = ({ navigation, route, data }) => {
  const { pregnancy, loadingPregnancy, adsSettings, periodStart } = data;
  const isPeriodDay = useIsPeriodDay();
  const { settings } = useContext(WomanInfoContext);
  const [fetching, setFetching] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
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

  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            ...styles.pickerHeartContainer,
            marginTop: STATUS_BAR_HEIGHT + rh(2),
          }}>
          <View style={styles.heartIconContainer}>
            <FontAwesome5 name="heart" size={30} color="white" />
          </View>

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
                  width: rw(88),
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
            <ScrollView contentContainerStyle={{ paddingHorizontal: rw(4) }}>
              <Text
                small
                marginBottom={rh(2)}
                textAlign="right"
                marginTop={rh(1)}
                marginRight={rw(1)}
                color={COLORS.grey}>
                {/* {adsSettings ? adsSettings.value : settings.app_text_ads.value} */}
                متن تست تبلیغات
              </Text>
            </ScrollView>
          </View>
        </View>
      </View>

      <Pressable
        style={{
          alignSelf: 'flex-end',
          marginRight: rw(4),
          marginTop: rh(1),
        }}
        onPress={() => navigation.openDrawer()}>
        <MaterialCommunityIcons name="menu" color={COLORS.grey} size={28} />
      </Pressable>

      <View style={styles.pregnancyContainer}>
        <Image
          imageSource={require('../../assets/images/600.png')}
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

      <View style={styles.pDayIcon}>
        <Ionicons
          name="md-play-circle-outline"
          size={28}
          color={COLORS.white}
        />
        <Fontisto name="blood-drop" size={25} color={COLORS.white} />
      </View>

      <Pressable
        onPress={() => navigation.navigate('ContactCounselor')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          marginTop: rh(4),
          marginRight: rw(4),
        }}>
        <Text medium bold color={COLORS.grey} marginRight={rw(1)}>
          تماس با کارشناس
        </Text>
        <View style={styles.counselorIcon}>
          <FontAwesome5 name="comments" size={30} color={COLORS.white} />
        </View>
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
    fontFamily: 'Qs_Iranyekan_bold',
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
  },
  unselectedDate: {
    fontFamily: 'Qs_Iranyekan_bold',
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.dark,
  },
  pDayIcon: {
    width: rw(24),
    backgroundColor: COLORS.rossoCorsa,
    height: rh(4.5),
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  heartIconContainer: {
    backgroundColor: COLORS.rossoCorsa,
    height: rh(11.5),
    width: rw(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: rw(2),
  },
  counselorIcon: {
    backgroundColor: COLORS.grey,
    width: rw(15),
    height: rh(7),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    alignSelf: 'flex-end',
  },
});

export default RedTheme;
