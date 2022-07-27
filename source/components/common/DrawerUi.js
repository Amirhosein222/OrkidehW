/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Image,
  ActivityIndicator,
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
import { numberConverter } from '../../libs/helpers';

const DrawerUi = ({ navigation }) => {
  const womanInfo = useContext(WomanInfoContext);
  const isPeriodDay = useIsPeriodDay();

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

  const navigate = function (screen) {
    navigation.navigate(screen);
    navigation.closeDrawer();
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onBuyAccount = async () => {
    setBuyAccount();
  };

  const onSelectSpouse = (spouse) => {
    setActiveSpouse(spouse);
  };

  const handleExitModal = function () {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (buyAccount.data) {
      buyAccount.data.is_successful
        ? Linking.openURL(buyAccount.data.data.action)
        : setSnackbar({
            msg: buyAccount.data.message,
            visible: true,
            type: 'error',
          });
    }
  }, [buyAccount]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        ...SCROLL_VIEW_CONTAINER,
        paddingTop: STATUS_BAR_HEIGHT + rh(2),
      }}>
      {womanInfo.fullInfo && (
        <>
          <View
            style={{
              ...styles.imageContainer,
              justifyContent: womanInfo.activeRel ? 'space-between' : 'center',
            }}>
            {womanInfo.activeRel && (
              <View style={styles.womanAvatarContainer}>
                <View style={styles.avatarContainer}>
                  {womanInfo.activeRel.image ? (
                    <Image
                      source={{ uri: baseUrl + womanInfo.activeRel.image }}
                      style={styles.avatar}
                      resizeMode="contain"
                    />
                  ) : (
                    <Fontisto
                      name="male"
                      size={92}
                      color={COLORS.dark}
                      style={{ marginBottom: 'auto', marginTop: rh(0.8) }}
                    />
                  )}
                  <View style={styles.nameContainer}>
                    <Text color="white">{womanInfo.activeRel.label}</Text>
                  </View>
                </View>
                <Text marginTop="5">
                  {numberConverter(womanInfo.activeRel.mobile)}
                </Text>
              </View>
            )}
            <View style={styles.womanAvatarContainer}>
              <View style={styles.avatarContainer}>
                {womanInfo.fullInfo.image ? (
                  <Image
                    source={{ uri: baseUrl + womanInfo.fullInfo.image }}
                    style={styles.avatar}
                    resizeMode="stretch"
                  />
                ) : (
                  <Fontisto
                    name="female"
                    size={90}
                    color={COLORS.dark}
                    style={{ marginBottom: 'auto', marginTop: rh(0.8) }}
                  />
                )}

                <View style={styles.nameContainer}>
                  <Text color="white">{womanInfo.fullInfo.display_name}</Text>
                </View>
              </View>
              <Text marginTop="5">
                {numberConverter(womanInfo.fullInfo.mobile)}
              </Text>
            </View>
          </View>

          {womanInfo.relations.length && womanInfo.fullInfo ? (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                marginBottom: rh(3),
              }}>
              <Picker
                data={womanInfo.relations}
                onItemSelect={onSelectSpouse}
                reset={resetPicker}
                placeholder={
                  womanInfo.activeRel
                    ? womanInfo.activeRel.label
                    : 'انتخاب رابطه'
                }
                listMode="SCROLLVIEW"
              />
            </View>
          ) : (
            <NoRelation navigation={navigation} />
          )}

          {womanInfo.fullInfo.account_type === '' && (
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
                <Text marginRight="20" color={COLORS.white}>
                  استفاده کامل از امکانات
                </Text>
              )}
              <AntDesign name="staro" color={COLORS.white} size={20} />
            </Pressable>
          )}
          <Pressable
            onPress={() => Linking.openURL(`tel:${emergency}`)}
            style={styles.itemContainer}>
            <Text marginRight="20">تماس اضطراری</Text>
            <MaterialCommunityIcons
              name="phone-plus"
              color={COLORS.red}
              size={30}
            />
          </Pressable>
          {womanInfo.relations.length ? (
            <Pressable
              onPress={() => navigate('Symptoms')}
              style={styles.itemContainer}>
              <Text marginRight="20">انتظارات همسر</Text>
              <AntDesign name="heart" color={COLORS.dark} size={22} />
            </Pressable>
          ) : null}
        </>
      )}

      <Pressable
        onPress={() => navigate('ContactSpouse')}
        style={styles.itemContainer}>
        <Text marginRight="20">روابط من</Text>
        <MaterialCommunityIcons
          name="human-male-female"
          color={COLORS.dark}
          size={30}
        />
      </Pressable>
      <Pressable
        onPress={() => navigate('VerifyRelation')}
        style={styles.itemContainer}>
        <Text marginRight="20">تایید رابطه</Text>
        <FontAwesome5 name="user-check" color={COLORS.dark} size={22} />
      </Pressable>
      <Pressable
        onPress={() => navigate('PsychologyTests')}
        style={styles.itemContainer}>
        <Text marginRight="20">تست های روانشناسی</Text>
        <FontAwesome5
          name="clipboard-list"
          color={COLORS.dark}
          size={28}
          style={{ marginRight: rw(1) }}
        />
      </Pressable>
      <Pressable
        onPress={() => navigate('Charts')}
        style={styles.itemContainer}>
        <Text marginRight="20">نمودار وضعیت من</Text>
        <FontAwesome5 name="chart-bar" color={COLORS.dark} size={28} />
      </Pressable>
      <Pressable
        onPress={() => navigate('ContactCounselor')}
        style={styles.itemContainer}>
        <Text marginRight="20"> تماس با کارشناس</Text>
        <MaterialCommunityIcons
          name="account-group"
          color={COLORS.dark}
          size={28}
        />
      </Pressable>
      <Pressable
        onPress={() => navigate('ProfileUpdate')}
        style={styles.itemContainer}>
        <Text marginRight="20">تنظیمات</Text>
        <Ionicons name="ios-settings-sharp" color={COLORS.dark} size={28} />
      </Pressable>
      <Divider
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
        width="100%"
      />
      <Pressable
        onPress={() => navigate('AppGuide')}
        style={styles.itemContainer}>
        <Text marginRight="20">راهنما</Text>
        <FontAwesome5 name="map-signs" color={COLORS.dark} size={28} />
      </Pressable>
      <Pressable
        onPress={() => navigate('AboutUs')}
        style={styles.itemContainer}>
        <Text marginRight="20">درباره اپلیکیشن</Text>
        <MaterialCommunityIcons
          name="google-circles-extended"
          color={COLORS.dark}
          size={28}
        />
      </Pressable>
      <Pressable
        onPress={() => navigate('Developers')}
        style={styles.itemContainer}>
        <Text marginRight="20">سازندگان اپلیکیشن</Text>
        <FontAwesome5 name="laptop-code" color={COLORS.dark} size={28} />
      </Pressable>
      <Pressable onPress={() => handleExitModal()} style={styles.itemContainer}>
        <Text marginRight="20">خروج از حساب کاربری</Text>
        <MaterialCommunityIcons
          name="exit-to-app"
          color={COLORS.dark}
          size={30}
        />
      </Pressable>
      <ExitModal
        visible={showModal}
        navigation={navigation}
        closeModal={handleExitModal}
      />
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: rh(0),
    paddingHorizontal: rw(2),
    alignSelf: 'center',
  },
  avatarContainer: {
    borderWidth: 1,
    borderColor: COLORS.dark,
    width: rw(32.5),
    height: rh(15.5),
    borderRadius: 5,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  womanAvatarNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    position: 'absolute',
    top: rh(12.5),
    width: '100%',
    backgroundColor: 'rgba(100,100,100, 0.5)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  pickerContainer: {
    height: 40,
    width: '60%',
    marginTop: 5,
  },
  labelStyle: {
    color: 'black',
    fontFamily: 'Vazir',
    fontSize: 14,
  },
});

export default DrawerUi;
