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

import { CalendarModal } from '../../screens/calendar/components';

import CalendarIcon from '../../assets/icons/drawerSettings/calendar-menu.svg';
import SympMenu from '../../assets/icons/drawerSettings/symptoms-menu.svg';
import MemMenu from '../../assets/icons/drawerSettings/memories-menu.svg';
import SweetHeartMenu from '../../assets/icons/drawerSettings/sweetheart-menu.svg';
import PsycheTestMenu from '../../assets/icons/drawerSettings/psychologicalTest-menu.svg';
import ChartMenu from '../../assets/icons/drawerSettings/chart-menu.svg';
import ContactAnExpertMenu from '../../assets/icons/drawerSettings/contactAnExpert-menu.svg';
import SettingMenu from '../../assets/icons/drawerSettings/setting-menu.svg';
import Instruction from '../../assets/icons/drawerSettings/instruction.svg';

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

  const navigate = function (screen) {
    navigation.navigate(screen);
    navigation.closeDrawer();
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
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
                  size={13}
                  bold
                  color={COLORS.textDark}
                  textAlign="right"
                  alignSelf="flex-end">
                  {womanInfo.fullInfo.name}
                </Text>
                <Text
                  size={11}
                  bold
                  color={COLORS.textLight}
                  alignSelf="flex-end">
                  {womanInfo.fullInfo.mobile}
                </Text>
              </View>
              {womanInfo.fullInfo.image ? (
                <View style={styles.avatarBorderdContainer}>
                  <Image
                    source={{ uri: baseUrl + womanInfo.fullInfo.image }}
                    style={styles.avatar}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={styles.avatarBorderdContainer}>
                  <View style={styles.avatarDefaultBorderd}>
                    <Image
                      source={require('../../assets/vectors/profile/woman-1.png')}
                      style={styles.avatarDefault}
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
                    size={13}
                    bold
                    color={COLORS.textDark}
                    textAlign="right"
                    alignSelf="flex-end">
                    {womanInfo.activeRel.label}
                  </Text>
                  <Text
                    size={11}
                    bold
                    color={COLORS.textLight}
                    alignSelf="flex-end">
                    {womanInfo.activeRel.mobile}
                  </Text>
                </View>
                {womanInfo.activeRel.image ? (
                  <View style={styles.avatarBorderdContainer}>
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
                    }}>
                    <View style={styles.avatarDefaultBorderd}>
                      <Image
                        source={require('../../assets/vectors/profile/man-1.png')}
                        style={styles.avatarDefault}
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
          <Text size={11} bold marginRight="15">
            تقویم
          </Text>
          <CalendarIcon style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('PeriodTabs')}
          style={{ ...styles.itemContainer, marginLeft: rw(1) }}>
          <Text size={11} bold marginRight="15">
            علائم من
          </Text>
          <SympMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('MemoriesTab')}
          style={{ ...styles.itemContainer, marginLeft: rw(2) }}>
          <Text size={11} bold marginRight="15">
            خاطرات من
          </Text>
          <MemMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('PeriodTabs')}
          style={{ ...styles.itemContainer, marginLeft: rw(1) }}>
          <Text size={11} bold marginRight="15">
            دلبر
          </Text>
          <SweetHeartMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('PsychologyTests')}
          style={styles.itemContainer}>
          <Text size={11} bold marginRight="15">
            تست های روانشناسی
          </Text>
          <PsycheTestMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('Charts')}
          style={styles.itemContainer}>
          <Text size={11} bold marginRight="15">
            نمودار وضعیت من
          </Text>
          <ChartMenu style={{ width: 25, height: 25 }} />
        </Pressable>

        <Pressable
          onPress={() => navigate('LearningBank')}
          style={styles.itemContainer}>
          <Text size={11} bold marginRight="15">
            مجله
          </Text>
          <Instruction style={{ width: 25, height: 25 }} />
        </Pressable>
        <Divider
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.textLight}
          width="100%"
          style={{ marginVertical: rh(1.5) }}
          borderWidth={1.5}
        />
        <Pressable
          onPress={() => navigate('Settings')}
          style={styles.itemContainer}>
          <Text size={11} bold marginRight="15">
            تنظیمات
          </Text>
          <SettingMenu style={{ width: 25, height: 25 }} />
        </Pressable>
        <Pressable
          onPress={() => navigate('ContactCounselor')}
          style={styles.itemContainer}>
          <Text size={11} bold marginRight="15">
            {' '}
            ارتباط با کارشناس
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
    marginRight: rw(4),
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.mainBg,
    flex: 1,
    paddingHorizontal: rw(7),
    marginTop: rh(2),
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
    height: rh(14),
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: rw(6),
    // backgroundColor: 'yellow',
  },
  avatarBorderdContainer: {
    backgroundColor: COLORS.inputTabBarBg,
    width: 100,
    height: 100,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  avatarDefaultBorderd: {
    backgroundColor: COLORS.inputTabBarBg,
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  nameContainer: {
    paddingRight: rw(3),
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  avatarDefault: { width: 70, height: 70 },
});

export default DrawerUi;
