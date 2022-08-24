/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment-jalaali';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HorizontalDatePicker from '@logisticinfotech/react-native-horizontal-date-picker';

import getLoginClient from '../../libs/api/loginClientApi';
import {
  saveActiveRel,
  WomanInfoContext,
} from '../../libs/context/womanInfoContext';

import {
  BackgroundView,
  Text,
  Header,
  Divider,
  Snackbar,
  NoRelation,
  Picker,
} from '../../components/common';
import ExpectationCard from '../../components/common/ExpectationCard';

import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const SymptomsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [expectations, setExpectation] = useState([]);
  const [spouseMoods, setSpouseMoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [resetPicker, setResetPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const womanInfo = useContext(WomanInfoContext);

  const onDateChange = function (date) {
    getSpouseMoodsAndExps(date);
  };

  const getSpouseMoodsAndExps = async function (moodDate) {
    setSpouseMoods([]);
    setExpectation([]);
    setIsLoading(true);
    const loginClient = await getLoginClient();

    const formData = new FormData();
    formData.append('relation_id', womanInfo.activeRel.relId);
    formData.append('gender', 'woman');
    formData.append('date', moodDate);
    formData.append('include_sign', 1);
    formData.append('include_mood', 1);
    formData.append('include_expectation', 1);
    loginClient
      .post('show/spouse/moods/and/expectation', formData)
      .then((response) => {
        setIsLoading(false);
        if (response.data.is_successful) {
          setExpectation(response.data.data.expects);
          setSpouseMoods(response.data.data.signs);
        } else {
          setSnackbar({
            msg: response.data.message.hasOwnProperty('relation_id')
              ? response.data.message.relation_id
              : response.data.message,
            visible: true,
          });
        }
      });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const setActiveSpouse = async function (value) {
    if (typeof value === 'object') {
      return true;
    }
    resetPicker && setResetPicker(false);
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', value);
    formData.append('gender', 'woman');
    loginClient.post('active/relation', formData).then((response) => {
      if (response.data.is_successful) {
        AsyncStorage.setItem(
          'lastActiveRelId',
          JSON.stringify(response.data.data.id),
        );
        saveActiveRel({
          relId: response.data.data.id,
          label: response.data.data.man_name,
          image: response.data.data.man_image,
          mobile: response.data.data.man.mobile,
          birthday: response.data.data.man.birth_date,
        });
        setSnackbar({
          msg: 'این رابطه به عنوان رابطه فعال شما ثبت شد.',
          visible: true,
          type: 'success',
        });
      } else {
        setResetPicker(true);
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };

  const onSelectSpouse = (spouse) => {
    setActiveSpouse(spouse);
  };

  const renderSpouseMoods = function ({ item }) {
    return (
      <View
        style={{
          marginHorizontal: rw(1),
          width: rw(30),
          // backgroundColor: 'cyan',
          flexShrink: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ marginBottom: 'auto' }}>
          <Text color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}>
            {item.sign.title} {item.mood.title}
          </Text>
        </View>

        {/* <Image
          imageSource={require('../../assets/images/pa.png')}
          width="75px"
          height="75px"
          marginTop={rh(0.6)}
        /> */}
      </View>
    );
  };

  useEffect(() => {
    if (womanInfo.activeRel) {
      setSelectedDate(moment());
      getSpouseMoodsAndExps(moment().locale('en').format('jYYYY/jMM/jDD'));
    }
  }, [womanInfo.activeRel]);

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.topContent}>
        <Header
          navigation={navigation}
          style={{ marginTop: STATUS_BAR_HEIGHT + rh(2) }}
        />

        {womanInfo.relations.length && womanInfo.activeRel ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <HorizontalDatePicker
              pickerType={'date'}
              onDateSelected={(date) => onDateChange(date)}
              minDate={new Date(Date.now() - 12096e5)}
              maxDate={new Date()}
              dayFormat="jDD"
              monthFormat="jMMMM"
              isShowYear={false}
              returnDateFormat={'jYYYY/jMM/jDD'}
              datePickerContainerStyle={{
                backgroundColor: 'transparent',
                marginTop: rh(2),
              }}
              selectedTextStyle={styles.selectedDate}
              unSelectedTextStyle={styles.unselectedDate}
              isPeriodDay={isPeriodDay}
            />
            <Text color={COLORS.grey} medium marginTop={rh(2)}>
              علائم همسر
            </Text>
            {spouseMoods.length ? (
              <FlatList
                data={spouseMoods}
                keyExtractor={(item) => String(item.id)}
                horizontal
                renderItem={renderSpouseMoods}
                contentContainerStyle={{
                  marginVertical: rh(3),
                  paddingHorizontal: rw(2),
                }}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  marginVertical: rh(1),
                }}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text color={COLORS.red}>
                    علائمی برای این تاریخ ثبت نشده است.
                  </Text>
                )}
              </View>
            )}

            <Divider
              width={rw(80)}
              color={COLORS.primary}
              style={{ marginTop: 5 }}
            />
            <Text color={COLORS.grey} medium marginTop={rh(2)}>
              انتظارات همسر
            </Text>

            {expectations.length ? (
              <FlatList
                data={expectations}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '100%',
                }}
                renderItem={(item) => {
                  return <ExpectationCard exp={item.item} />;
                }}
              />
            ) : isLoading ? (
              <View style={{ marginTop: rh(2) }}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : (
              <View>
                <Text color={COLORS.red}>انتظاری برای امروز وجود ندارد</Text>
              </View>
            )}
          </View>
        ) : womanInfo.relations.length && !womanInfo.activeRel ? (
          <View style={styles.noRel}>
            <Text color={COLORS.red}>رابطه فعال خود را انتخاب کنید</Text>
            <Picker
              data={womanInfo.relations}
              onItemSelect={onSelectSpouse}
              reset={resetPicker}
              placeholder="انتخاب رابطه"
            />
          </View>
        ) : (
          <NoRelation navigation={navigation} />
        )}
      </View>

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
  btn: {
    width: '70%',
    height: 40,
    marginTop: 10,
    alignSelf: 'center',
  },
  noRel: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  topContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
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
});

export default SymptomsScreen;
