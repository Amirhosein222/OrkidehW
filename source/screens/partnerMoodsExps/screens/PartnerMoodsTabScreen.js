/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  StatusBar,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'jalali-moment';

import {
  BackgroundView,
  Snackbar,
  ShowLovePopup,
  Picker,
  Text,
  NoRelation,
} from '../../../components/common';
import { ExpSympCard } from '../components';

import { useIsPeriodDay } from '../../../libs/hooks';
import { COLORS, rh, rw } from '../../../configs';
import getLoginClient from '../../../libs/api/loginClientApi';
import {
  WomanInfoContext,
  saveActiveRel,
} from '../../../libs/context/womanInfoContext';

import nothingIcon from '../../../assets/icons/others/nothing.png';

const PartnerMoodsTabScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [spouseMoods, setSpouseMoods] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetPicker, setResetPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showLove, setShowLove] = useState(false);

  const womanInfo = useContext(WomanInfoContext);

  const getSpouseMoodsAndExps = async function () {
    setSpouseMoods([]);
    setIsLoading(true);
    const loginClient = await getLoginClient();

    const formData = new FormData();
    formData.append('relation_id', womanInfo.activeRel.relId);
    formData.append('gender', 'woman');
    formData.append(
      'date',
      moment(new Date(), 'YYYY/MM/DD').locale('en').format('jYYYY/jMM/jDD'),
    );
    formData.append('include_sign', 1);
    formData.append('include_mood', 1);
    formData.append('include_expectation', 1);
    loginClient
      .post('show/spouse/moods/and/expectation', formData)
      .then(response => {
        setIsRefreshing(false);
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

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    getSpouseMoodsAndExps();
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  const setActiveSpouse = async function (value) {
    if (typeof value === 'object') {
      return true;
    }
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', value);
    formData.append('gender', 'woman');
    loginClient.post('active/relation', formData).then(response => {
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
        setResetPicker(!resetPicker);
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };

  const onSelectSpouse = spouse => {
    if (spouse === 'newRel') {
      setResetPicker(!resetPicker);
      return navigation.navigate('AddRel', {
        handleUpdateRels: womanInfo.getAndHandleRels,
        showSnackbar: setSnackbar,
      });
    }
    setActiveSpouse(spouse);
  };

  const RenderItems = ({ item }) => {
    return <ExpSympCard item={item} type="sign" />;
  };

  useEffect(() => {
    if (womanInfo.activeRel) {
      getSpouseMoodsAndExps();
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
            {spouseMoods.length ? (
              <FlatList
                data={spouseMoods}
                onRefresh={onRefresh}
                refreshing={isRefreshing}
                keyExtractor={item => item.id}
                renderItem={RenderItems}
                numColumns={2}
                style={{ marginTop: rh(0) }}
                showsVerticalScrollIndicator={false}
              />
            ) : isLoading ? (
              <ActivityIndicator
                size="large"
                color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
                style={{
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  bottom: rh(2),
                }}
              />
            ) : (
              <View style={styles.noMood}>
                <Image
                  source={nothingIcon}
                  style={{
                    width: rw(52),
                  }}
                  resizeMode="contain"
                />
                <Text bold size={13} color={COLORS.textLight}>
                  دلبر شما امروز چیزی رو ثبت نکرده!
                </Text>
                <Pressable onPress={getSpouseMoodsAndExps}>
                  <Ionicons
                    name="md-refresh"
                    size={26}
                    style={{ marginTop: rh(2) }}
                  />
                </Pressable>
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
