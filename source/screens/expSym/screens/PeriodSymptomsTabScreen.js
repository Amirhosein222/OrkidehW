/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ActivityIndicator, FlatList } from 'react-native';
import moment from 'jalali-moment';

import {
  BackgroundView,
  Snackbar,
  ShowLovePopup,
} from '../../../components/common';
import { ExpSympInfoModal, ExpSympCard, SympDegreeModal } from '../components';

import { getSymptomsApi, getMySignsApi } from '../apis';
import { useApi } from '../../../libs/hooks';
import { useIsPeriodDay } from '../../../libs/hooks';
import { COLORS, rh } from '../../../configs';

const PeriodSymptomsTabScreen = () => {
  const isPeriodDay = useIsPeriodDay();
  const selectedSymp = useRef(null);
  const [symptoms, setSymptoms] = useState(null);
  const [mySymptoms, setMySymptoms] = useState([]);
  const [signId, setSignId] = useState(null);
  const [signDate, setSignDate] = useState({
    jDate: moment(new Date(), 'YYYY/MM/DD')
      .locale('en')
      .format('jYYYY/jMM/jDD'),
    dDate: new Date(),
  });
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showLove, setShowLove] = useState(false);

  const [getSymptoms, setGetSymptoms] = useApi(() => getSymptomsApi());
  const [mySigns, setMySigns] = useApi(() => getMySignsApi(signDate.jDate));

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

  const openInfoModal = symp => {
    selectedSymp.current = symp;
    setShowInfoModal(true);
  };

  const RenderItems = ({ item }) => {
    const alreadySelected =
      (mySymptoms.length &&
        mySymptoms.filter(symp => symp.sign_id === item.id).pop()) ||
      false;
    return (
      <ExpSympCard
        item={item}
        onPress={onSymptomSelect}
        onReadMore={openInfoModal}
        alreadySelected={alreadySelected}
        setSnackbar={setSnackbar}
        updateData={setMySigns}
      />
    );
  };

  useEffect(() => {
    onGetSymptoms();
  }, []);

  useEffect(() => {
    setMySigns();
  }, [signDate]);

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

  useEffect(() => {
    if (mySigns.data && mySigns.data.is_successful) {
      setMySymptoms(mySigns.data.data);
    }
    mySigns.data &&
      !mySigns.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [mySigns]);

  if (getSymptoms.isFetching) {
    return (
      <BackgroundView resizeMode="cover">
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
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

        <FlatList
          data={symptoms}
          keyExtractor={item => item.id}
          renderItem={RenderItems}
          numColumns={2}
          style={{ marginTop: rh(0) }}
          showsVerticalScrollIndicator={false}
        />
        {showModal && (
          <SympDegreeModal
            visible={showModal}
            closeModal={() => setShowModal(false)}
            sign={signId}
            signDate={signDate.jDate}
            setSnackbar={setSnackbar}
            updateMySigns={setMySigns}
          />
        )}
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
        {showLove ? (
          <ShowLovePopup handleVisible={() => setShowLove(false)} />
        ) : null}
      </BackgroundView>
    );
  }
};

export default PeriodSymptomsTabScreen;
