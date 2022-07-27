/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  View,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HorizontalDatePicker from '@logisticinfotech/react-native-horizontal-date-picker';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  Text,
  IconWithBg,
  SignsMoodModal,
  Snackbar,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { baseUrl, COLORS, rh, rw } from '../../configs';

const PeriodSymptomsTabScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [symptoms, setSymptoms] = useState(null);
  const [signId, setSignId] = useState(null);
  const [signDate, setSignDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getSymptoms = async function () {
    const loginClient = await getLoginClient();
    loginClient.get('get/all/signs?gender=woman').then((response) => {
      setIsLoading(true);
      if (response.data.is_successful) {
        setSymptoms(response.data.data);
      } else {
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
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

  const onSymptomSelect = async function (sign) {
    if (!signDate) {
      setSnackbar({
        msg: 'لطفا ابتدا تاریخ را انتخاب کنید.',
        visible: true,
      });
      return;
    }
    setSignId({ id: sign.id, is_multiple: sign.is_multiple });
    setShowModal(!showModal);
  };

  const onCloseModal = function () {
    setShowModal(!showModal);
  };

  const onDateSelected = async function (date) {
    setSignDate(date);
  };

  const RenderItems = ({ item }) => {
    return (
      <Pressable
        onPress={() => onSymptomSelect(item)}
        style={styles.symptomContainer}>
        {item.image ? (
          <View style={styles.sympImageContainer}>
            <Image
              source={{ uri: baseUrl + item.image }}
              style={styles.sympImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <IconWithBg
            bgColor={COLORS.white}
            width="89px"
            height="89px"
            borderRadius="50px"
            icon="account-heart"
            iconColor={COLORS.red}
            iconSize={50}
            borderColor="red"
            borderWidth="2px"
          />
        )}

        <Text color={COLORS.red} style={{ marginTop: rh(1) }}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  useEffect(() => {
    getSymptoms();
  }, []);

  if (!isLoading) {
    return (
      <Container>
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
        />
      </Container>
    );
  } else {
    return (
      <Container>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Pressable
          onPress={() => navigation.openDrawer()}
          style={{ alignSelf: 'flex-end', marginTop: rh(1) }}>
          <MaterialCommunityIcons
            name="menu"
            color={COLORS.grey}
            size={28}
            style={{ marginRight: rh(2) }}
          />
        </Pressable>
        <HorizontalDatePicker
          pickerType={'date'}
          onDateSelected={(date) => onDateSelected(date)}
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
        <FlatList
          data={symptoms}
          keyExtractor={(item) => item.id}
          renderItem={RenderItems}
          numColumns={3}
          style={{ marginTop: 30 }}
          showsVerticalScrollIndicator={false}
        />
        {showModal === true ? (
          <SignsMoodModal
            visible={showModal}
            closeModal={onCloseModal}
            sign={signId}
            signDate={signDate}
          />
        ) : null}

        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </Container>
    );
  }
};

const styles = StyleSheet.create({
  btn: {
    width: '45%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 20,
  },
  symptomContainer: {
    width: rw(25),
    flexShrink: 1,
    marginHorizontal: rw(3),
    marginVertical: rh(2),
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
  sympImage: {
    width: 50,
    height: 50,
  },
  sympImageContainer: {
    width: 89,
    height: 89,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45,
    borderColor: 'red',
    borderWidth: 2,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});

export default PeriodSymptomsTabScreen;
