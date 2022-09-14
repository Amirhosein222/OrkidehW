/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NoRelation, Picker } from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import getLoginClient from '../../libs/api/loginClientApi';
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

import CalendarIcon from '../../assets/icons/drawerSettings/calendar-menu.svg';
import SympMenu from '../../assets/icons/drawerSettings/symptoms-menu.svg';
import MemMenu from '../../assets/icons/drawerSettings/memories-menu.svg';
import SweetHeartMenu from '../../assets/icons/drawerSettings/sweetheart-menu.svg';
import PsycheTestMenu from '../../assets/icons/drawerSettings/psychologicalTest-menu.svg';
import ChartMenu from '../../assets/icons/drawerSettings/chart-menu.svg';
import ContactAnExpertMenu from '../../assets/icons/drawerSettings/contactAnExpert-menu.svg';
import SettingMenu from '../../assets/icons/drawerSettings/setting-menu.svg';

const DrawerUi = ({ navigation }) => {
  const womanInfo = useContext(WomanInfoContext);
  const isPeriodDay = useIsPeriodDay();

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [resetPicker, setResetPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

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
                  bold
                  color={COLORS.textDark}
                  textAlign="right"
                  alignSelf="flex-end">
                  {womanInfo.fullInfo.display_name}
                </Text>
                <Text bold color={COLORS.textLight} alignSelf="flex-end">
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
                    <Image
                      source={require('../../assets/vectors/profile/woman-1.png')}
                      style={{ ...styles.avatar, width: 90, height: 90 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            </View>
            {womanInfo.activeRel && (
              <View style={styles.avatarContainer}>
                <View style={styles.nameContainer}>
                  <Text
                    medium
                    bold
                    color={COLORS.textDark}
                    textAlign="right"
                    alignSelf="flex-end">
                    {womanInfo.activeRel.label}
                  </Text>
                  <Text bold color={COLORS.textLight} alignSelf="flex-end">
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
                      <Image
                        source={require('../../assets/vectors/profile/man-1.png')}
                        style={{ ...styles.avatar, width: 90, height: 90 }}
                        resizeMode="contain"
                      />
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
        </>
      )}
      <View style={styles.optionsContainer}>
        <Pressable
          onPress={() => setShowCalendarModal(true)}
          style={{ ...styles.itemContainer, marginLeft: rw(1) }}>
          <Text small bold marginRight="15">
            تقویم
          </Text>
          <CalendarIcon style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable style={{ ...styles.itemContainer, marginLeft: rw(1) }}>
          <Text small bold marginRight="15">
            علائم من
          </Text>
          <SympMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('MemoriesTab')}
          style={{ ...styles.itemContainer, marginLeft: rw(2) }}>
          <Text small bold marginRight="15">
            خاطرات من
          </Text>
          <MemMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('PeriodTabs')}
          style={{ ...styles.itemContainer, marginLeft: rw(1) }}>
          <Text small bold marginRight="15">
            دلبر
          </Text>
          <SweetHeartMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('PsychologyTests')}
          style={styles.itemContainer}>
          <Text small bold marginRight="15">
            تست های روانشناسی
          </Text>
          <PsycheTestMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('Charts')}
          style={styles.itemContainer}>
          <Text small bold marginRight="15">
            نمودار وضعیت من
          </Text>
          <ChartMenu style={{ width: 25, height: 25 }} />
        </Pressable>

        <Pressable
          onPress={() => navigate('ContactCounselor')}
          style={styles.itemContainer}>
          <Text small bold marginRight="15">
            مجله
          </Text>
          <ContactAnExpertMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Divider
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.textLight}
          width="100%"
          style={{ marginVertical: rh(1.5) }}
          borderWidth={0.8}
        />
        <Pressable
          onPress={() => navigate('Settings')}
          style={styles.itemContainer}>
          <Text small bold marginRight="15">
            تنظیمات
          </Text>
          <SettingMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('ContactCounselor')}
          style={styles.itemContainer}>
          <Text small bold marginRight="15">
            {' '}
            تماس با کارشناس
          </Text>
          <ContactAnExpertMenu style={{ width: 25, height: 25 }} />
        </Pressable>
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
    marginVertical: rh(1),
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.mainBg,
    flex: 1,
    paddingHorizontal: rw(8),
    marginTop: rh(1),
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
