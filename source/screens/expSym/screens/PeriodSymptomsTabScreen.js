/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ActivityIndicator, FlatList } from 'react-native';

import {
  BackgroundView,
  Snackbar,
  HDatePicker,
} from '../../../components/common';
import { ExpSympInfoModal, ExpSympCard, SympDegreeModal } from '../components';
import * as moment from 'jalali-moment';

import { getSymptomsApi } from '../apis';
import { useApi } from '../../../libs/hooks';
import { useIsPeriodDay } from '../../../libs/hooks';
import { COLORS, rh } from '../../../configs';

const PeriodSymptomsTabScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const selectedSymp = useRef(null);
  const [symptoms, setSymptoms] = useState(null);
  const [signId, setSignId] = useState(null);
  const [signDate, setSignDate] = useState({
    jDate: moment.from(new Date(), 'en', 'YYYY/MM/DD').format('jYYYY/jMM/jDD'),
    dDate: new Date(),
  });
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [getSymptoms, setGetSymptoms] = useApi(() => getSymptomsApi());

  const onGetSymptoms = async function () {
    setGetSymptoms();
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onSymptomSelect = async function (sign) {
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

  const onDateSelected = async function (jDate) {
    const dDate = moment.from(jDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
    var dateObj = new Date(dDate + 'T00:00:00');
    setSignDate({ jDate: jDate, dDate: dateObj });
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
    onGetSymptoms();
  }, []);

  useEffect(() => {
    if (getSymptoms.data && getSymptoms.data.is_successful) {
      setSymptoms(getSymptoms.data.data);
    }
    getSymptoms.data &&
      !getSymptoms.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [getSymptoms]);

  if (getSymptoms.isFetching) {
    return (
      <BackgroundView resizeMode="cover">
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      </BackgroundView>
    );
  } else {
    return (
      <BackgroundView resizeMode="cover">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <HDatePicker
          style={{ marginTop: rh(2) }}
          periodStart={null}
          onDateSelected={onDateSelected}
          isFetching={null}
          isPeriodDay={isPeriodDay}
          defaultSelected={signDate.dDate}
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
            signDate={signDate.jDate}
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
      </BackgroundView>
    );
  }
};

export default PeriodSymptomsTabScreen;
