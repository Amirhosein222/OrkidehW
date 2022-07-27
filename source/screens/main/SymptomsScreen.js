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
  Container,
  Image,
  Text,
  Header,
  Divider,
  TabBar,
  Snackbar,
  NoRelation,
  Picker,
} from '../../components/common';
import ExpectationCard from '../../components/common/ExpectationCard';

import { COLORS, rh, STATUS_BAR_HEIGHT } from '../../configs';
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
            msg: response.data.message,
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
          relId: response.data.data.man.id,
          label: response.data.data.man_name,
          image: response.data.data.man_image,
          mobile: response.data.data.man.mobile,
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
      <View style={{ margin: 10 }}>
        <Text color={COLORS.pink}>
          {item.sign.title} {item.mood.title}
        </Text>
        <Image
          imageSource={require('../../assets/images/pa.png')}
          width="75px"
          height="75px"
        />
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
    <Container justifyContent="flex-start">
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
        <Divider width="90%" color={COLORS.grey} style={{ marginBottom: 5 }} />

        {womanInfo.relations.length && womanInfo.activeRel ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              flex: 1,
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
              datePickerContainerStyle={{ backgroundColor: 'white' }}
              selectedTextStyle={styles.selectedDate}
              unSelectedTextStyle={styles.unselectedDate}
              isPeriodDay={isPeriodDay}
            />

            {spouseMoods.length ? (
              <FlatList
                data={spouseMoods}
                keyExtractor={(item) => String(item.id)}
                horizontal
                renderItem={renderSpouseMoods}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: rh(2),
                }}>
                {isLoading ? (
                  <ActivityIndicator size="large" color={COLORS.pink} />
                ) : (
                  <Text marginBottom="10" color={COLORS.red}>
                    علائمی برای این تاریخ ثبت نشده است.
                  </Text>
                )}
              </View>
            )}

            <Divider width="90%" color={COLORS.pink} style={{ marginTop: 5 }} />
            <Text color={COLORS.grey} medium>
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
              <View style={{ flex: 1 }}>
                <ActivityIndicator size="large" color={COLORS.pink} />
              </View>
            ) : (
              <View style={{ flex: 1 }}>
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

      <TabBar seperate={true} navigation={navigation} />
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
  btn: {
    width: '70%',
    height: 40,
    marginTop: 10,
    alignSelf: 'center',
  },
  noRel: {
    width: '100%',
    marginTop: 20,
  },
  topContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
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

export default SymptomsScreen;
