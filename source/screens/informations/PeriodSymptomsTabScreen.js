/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import HorizontalDatePicker from '@logisticinfotech/react-native-horizontal-date-picker';

import getLoginClient from '../../libs/api/loginClientApi';

import { Container, Snackbar } from '../../components/common';
import {
  ExpSympInfoModal,
  ExpSympCard,
  SympDegreeModal,
} from '../../components/expectationsAndSymptoms';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw } from '../../configs';

const PeriodSymptomsTabScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [symptoms, setSymptoms] = useState(null);
  const [signId, setSignId] = useState(null);
  const [signDate, setSignDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const selectedSymp = useRef(null);

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
    setSignId(sign);
    setShowModal(!showModal);
  };

  const openInfoModal = (symp) => {
    selectedSymp.current = symp;
    setShowInfoModal(true);
  };

  const onCloseModal = function () {
    setShowModal(!showModal);
  };

  const onDateSelected = async function (date) {
    setSignDate(date);
  };

  const RenderItems = ({ item }) => {
    return (
      <ExpSympCard
        item={item}
        onPress={onSymptomSelect}
        onReadMore={openInfoModal}
      />
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
            marginTop: rh(2),
          }}
          selectedTextStyle={styles.selectedDate}
          unSelectedTextStyle={styles.unselectedDate}
          isPeriodDay={isPeriodDay}
        />
        <FlatList
          data={symptoms}
          keyExtractor={(item) => item.id}
          renderItem={RenderItems}
          numColumns={2}
          style={{ marginTop: rh(2) }}
          showsVerticalScrollIndicator={false}
        />
        {showModal === true ? (
          <SympDegreeModal
            visible={showModal}
            closeModal={onCloseModal}
            sign={signId}
            signDate={signDate}
          />
        ) : null}
        {selectedSymp.current && (
          <ExpSympInfoModal
            visible={showInfoModal}
            closeModal={() => setShowInfoModal(false)}
            item={selectedSymp.current}
          />
        )}

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
