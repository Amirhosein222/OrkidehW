/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Image,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NoRelation, Picker } from '../../components/common';

import { useIsPeriodDay, useApi } from '../../libs/hooks';
import getLoginClient from '../../libs/api/loginClientApi';
import { buyGoldenAccount } from '../../libs/apiCalls';
import {
  WomanInfoContext,
  saveActiveRel,
} from '../../libs/context/womanInfoContext';
import { Text, Divider, ExitModal, Snackbar } from './index';
import {
  baseUrl,
  COLORS,
  rh,
  rw,
  SCROLL_VIEW_CONTAINER,
  STATUS_BAR_HEIGHT,
} from '../../configs';
import { convertToFullDate, numberConverter } from '../../libs/helpers';

import CalendarModal from '../calendar/CalendarModal';

const DrawerUi = ({ navigation }) => {
  const womanInfo = useContext(WomanInfoContext);
  const isPeriodDay = useIsPeriodDay();

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [buyAccount, setBuyAccount] = useApi(() => buyGoldenAccount());
  const [resetPicker, setResetPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const emergency = 115;

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

  const navigate = function (screen) {
    navigation.navigate(screen);
    navigation.closeDrawer();
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onSelectSpouse = (spouse) => {
    setActiveSpouse(spouse);
  };

  const handleExitModal = function () {
    setShowModal(!showModal);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        ...SCROLL_VIEW_CONTAINER,
        paddingTop: STATUS_BAR_HEIGHT + rh(2),
        backgroundColor: COLORS.mainBg,
      }}>
      {womanInfo.fullInfo && (
        <>
          <View style={styles.userRelationContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.nameContainer}>
                <Text
                  medium
                  color={COLORS.textDark}
                  textAlign="right"
                  alignSelf="flex-end">
                  {womanInfo.fullInfo.display_name}
                </Text>
                <Text color={COLORS.textLight} alignSelf="flex-end">
                  {numberConverter(
                    convertToFullDate(womanInfo.fullInfo.birth_date),
                  )}
                </Text>
              </View>
              {womanInfo.fullInfo.image ? (
                <View
                  style={{
                    ...styles.avatarBorderdContainer,
                    width: 110,
                    height: 110,
                  }}>
                  <Image
                    source={{ uri: baseUrl + womanInfo.fullInfo.image }}
                    style={styles.avatar}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View
                  style={{
                    ...styles.avatarBorderdContainer,
                    width: 110,
                    height: 110,
                  }}>
                  <View style={styles.avatarBorderdContainer}>
                    <Fontisto name="female" size={60} color={COLORS.textDark} />
                  </View>
                </View>
              )}
            </View>
            {womanInfo.activeRel && (
              <View style={styles.avatarContainer}>
                <View style={styles.nameContainer}>
                  <Text
                    medium
                    color={COLORS.textDark}
                    textAlign="right"
                    alignSelf="flex-end">
                    {womanInfo.activeRel.label}
                  </Text>
                  <Text color={COLORS.textLight} alignSelf="flex-end">
                    {numberConverter(
                      convertToFullDate(womanInfo.activeRel.birthday),
                    )}
                  </Text>
                </View>
                {womanInfo.activeRel.image ? (
                  <View
                    style={{
                      ...styles.avatarBorderdContainer,
                      width: 110,
                      height: 110,
                    }}>
                    <Image
                      source={{ uri: baseUrl + womanInfo.activeRel.image }}
                      style={styles.avatar}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      ...styles.avatarBorderdContainer,
                      width: 110,
                      height: 110,
                    }}>
                    <View style={styles.avatarBorderdContainer}>
                      <Fontisto name="male" size={60} color={COLORS.textDark} />
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {womanInfo.relations.length && womanInfo.fullInfo ? (
            <Picker
              data={womanInfo.relations}
              onItemSelect={onSelectSpouse}
              reset={resetPicker}
              placeholder={
                womanInfo.activeRel ? womanInfo.activeRel.label : 'انتخاب رابطه'
              }
              listMode="SCROLLVIEW"
            />
          ) : (
            <NoRelation
              navigation={navigation}
              containerStyle={{ marginBottom: rh(2) }}
            />
          )}

          {/* {womanInfo.fullInfo.account_type === '' && (
            <Pressable
              onPress={onBuyAccount}
              style={[
                styles.itemContainer,
                { backgroundColor: '#F8CD00', marginTop: rh(4), height: 50 },
              ]}>
              {buyAccount.isFetching ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{ marginRight: rw(5) }}
                />
              ) : (
                <Text marginRight="15" color={COLORS.white}>
                  استفاده کامل از امکانات
                </Text>
              )}
              <AntDesign name="staro" color={COLORS.white} size={20} />
            </Pressable>
          )} */}

          {/* <Pressable
            onPress={() => Linking.openURL(`tel:${emergency}`)}
            style={styles.itemContainer}>
            <Text marginRight="15">تماس اضطراری</Text>
            <MaterialCommunityIcons
              name="phone-plus"
              color={COLORS.textDark}
              size={30}
            />
          </Pressable> */}
        </>
      )}
      <View style={styles.optionsContainer}>
        {/* {womanInfo.relations.length ? (
          <Pressable
            onPress={() => navigate('Symptoms')}
            style={{ ...styles.itemContainer, marginTop: rh(3) }}>
            <Text marginRight="15">انتظارات همسر</Text>
            <AntDesign name="heart" color={COLORS.textDark} size={22} />
          </Pressable>
        ) : null} */}
        {/* <Pressable
        onPress={() => navigate('ContactSpouse')}
        style={styles.itemContainer}>
        <Text marginRight="15">روابط من</Text>
        <MaterialCommunityIcons
          name="human-male-female"
          color={COLORS.textDark}
          size={30}
        />
      </Pressable>
      <Pressable
        onPress={() => navigate('VerifyRelation')}
        style={styles.itemContainer}>
        <Text marginRight="15">تایید رابطه</Text>
        <FontAwesome5 name="user-check" color={COLORS.textDark} size={22} />
      </Pressable> */}
        <Pressable
          onPress={() => setShowCalendarModal(true)}
          style={{ ...styles.itemContainer, marginLeft: rw(1) }}>
          <Text marginRight="15">تقویم</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/calendar-menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
        <Pressable
          // onPress={() => navigate('PsychologyTests')}
          style={{ ...styles.itemContainer, marginLeft: rw(1) }}>
          <Text marginRight="15">علائم من</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/symptoms-menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
        <Pressable
          onPress={() => navigate('MemoriesTab')}
          style={{ ...styles.itemContainer, marginLeft: rw(2) }}>
          <Text marginRight="15">خاطرات من</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/memories-menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
        <Pressable
          onPress={() => navigate('PeriodTabs')}
          style={{ ...styles.itemContainer, marginLeft: rw(1) }}>
          <Text marginRight="15">دلبر</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/sweetheart-menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
        <Pressable
          onPress={() => navigate('PsychologyTests')}
          style={styles.itemContainer}>
          <Text marginRight="15">تست های روانشناسی</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/psychologicalTest-menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
        <Pressable
          onPress={() => navigate('Charts')}
          style={styles.itemContainer}>
          <Text marginRight="15">نمودار وضعیت من</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/chart-menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
        <Pressable
          onPress={() => navigate('ContactCounselor')}
          style={styles.itemContainer}>
          <Text marginRight="15"> تماس با کارشناس</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/ContactAnExpert-menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>

        <Divider
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textDark}
          width="100%"
          style={{ marginVertical: rh(1.5) }}
        />
        <Pressable
          onPress={() => navigate('Settings')}
          style={styles.itemContainer}>
          <Text marginRight="15">تنظیمات</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/setting-menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
        {/* <Pressable
        onPress={() => navigate('AppGuide')}
        style={styles.itemContainer}>
        <Text marginRight="15">راهنما</Text>
        <FontAwesome5 name="map-signs" color={COLORS.textDark} size={28} />
      </Pressable>
      <Pressable
        onPress={() => navigate('AboutUs')}
        style={styles.itemContainer}>
        <Text marginRight="15">درباره اپلیکیشن</Text>
        <MaterialCommunityIcons
          name="google-circles-extended"
          color={COLORS.textDark}
          size={28}
        />
      </Pressable>
      <Pressable
        onPress={() => navigate('Developers')}
        style={styles.itemContainer}>
        <Text marginRight="15">سازندگان اپلیکیشن</Text>
        <FontAwesome5 name="laptop-code" color={COLORS.textDark} size={28} />
      </Pressable> */}
        {/* <Pressable onPress={() => handleExitModal()} style={styles.itemContainer}>
        <Text marginRight="15">خروج از حساب کاربری</Text>
        <MaterialCommunityIcons
          name="exit-to-app"
          color={COLORS.textDark}
          size={30}
        />
      </Pressable> */}
        <ExitModal
          visible={showModal}
          navigation={navigation}
          closeModal={handleExitModal}
        />
      </View>
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
          style={{ width: rw(65) }}
        />
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: COLORS.mainBg,
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: rh(2),
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.mainBg,
    flex: 1,
    paddingHorizontal: rw(8),
  },
  userRelationContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    width: '100%',
    height: rh(15.5),
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: rw(6),
  },
  avatarBorderdContainer: {
    backgroundColor: COLORS.inputTabBarBg,
    width: 100,
    height: 100,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  womanAvatarNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    paddingRight: rw(3),
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 90,
  },
});

export default DrawerUi;
