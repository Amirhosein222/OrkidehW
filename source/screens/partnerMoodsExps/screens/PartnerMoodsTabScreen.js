/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  StatusBar,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  BackgroundView,
  Snackbar,
  ShowLovePopup,
  Picker,
  Text,
  NoRelation,
} from '../../../components/common';
import { ExpSympCard } from '../components';
import * as moment from 'jalali-moment';

import { useIsPeriodDay } from '../../../libs/hooks';
import { COLORS, rh, rw } from '../../../configs';
import getLoginClient from '../../../libs/api/loginClientApi';
import {
  WomanInfoContext,
  saveActiveRel,
} from '../../../libs/context/womanInfoContext';

import deleteIcon from '../../../assets/vectors/register/delete.png';

const testData = [
  {
    created_at: 1661842138,
    id: 31,
    image: '/uploads/photos/1/flower.png',
    is_multiple: 0,
    title: 'متئ/مکنئو/کمنئ/متئم/',
    type: 'woman',
    updated_at: 1662529944,
  },
  {
    created_at: 1622671874,
    id: 23,
    image: '/uploads/photos/1/عکس-پریود-مردان.jpg',
    is_multiple: 0,
    title: 'بی حوصلگی',
    type: 'woman',
    updated_at: 1623580636,
  },
  {
    created_at: 1622671834,
    id: 22,
    image: null,
    is_multiple: 0,
    title: 'تحریک پذیری',
    type: 'woman',
    updated_at: 1622671834,
  },
];

const PartnerMoodsTabScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [spouseMoods, setSpouseMoods] = useState([]);
  const [resetPicker, setResetPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showLove, setShowLove] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    jDate: moment.from(new Date(), 'en', 'YYYY/MM/DD').format('jYYYY/jMM/jDD'),
    dDate: new Date(),
  });
  const womanInfo = useContext(WomanInfoContext);

  const onDateChange = function (jDate) {
    const dDate = moment.from(jDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
    var dateObj = new Date(dDate + 'T00:00:00');
    setSelectedDate({ jDate: jDate, dDate: dateObj });
    getSpouseMoodsAndExps(jDate);
  };

  const getSpouseMoodsAndExps = async function (moodDate) {
    setSpouseMoods([]);
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
        console.log('here ', response.data);
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

  const RenderItems = ({ item }) => {
    return <ExpSympCard item={item} />;
  };

  useEffect(() => {
    if (womanInfo.activeRel) {
      getSpouseMoodsAndExps(
        moment.from(new Date(), 'en', 'YYYY/MM/DD').format('jYYYY/jMM/jDD'),
      );
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
        {womanInfo.relations.length && womanInfo.activeRel ? (
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              flex: 1,
            }}>
            {/* <HDatePicker
              periodStart={null}
              onDateSelected={onDateChange}
              isFetching={null}
              isPeriodDay={isPeriodDay}
              defaultSelected={selectedDate.dDate}
            /> */}
            {testData.length ? (
              <FlatList
                data={testData}
                keyExtractor={(item) => item.id}
                renderItem={RenderItems}
                numColumns={2}
                style={{ marginTop: rh(0) }}
                showsVerticalScrollIndicator={false}
              />
            ) : isLoading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  bottom: rh(2),
                }}
              />
            ) : (
              <View style={styles.noMood}>
                <Image
                  source={deleteIcon}
                  style={{
                    width: rw(52),
                  }}
                  resizeMode="contain"
                />
                <Text medium bold color={COLORS.textLight}>
                  پارتنر شما امروز چیزی رو ثبت نکرده!
                </Text>
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
      {showLove ? (
        <ShowLovePopup handleVisible={() => setShowLove(false)} />
      ) : null}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  noRel: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  topContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  selectedDate: {
    fontFamily: 'IRANYekanMobileBold',
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
  },
  noMood: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
    bottom: rh(4),
  },
});

export default PartnerMoodsTabScreen;
