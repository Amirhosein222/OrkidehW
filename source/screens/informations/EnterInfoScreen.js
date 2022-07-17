/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { Image, StatusBar, StyleSheet } from 'react-native';

import { Container, Snackbar } from '../../components/common';
import {
  EnterName,
  PeriodInfo,
  SetPassword,
} from '../../components/informations';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { rh, rw } from '../../configs';

const EnterInfoScreen = ({ navigation, route }) => {
  const { registerStage, handleRegisterStage, settings } = useContext(
    WomanInfoContext,
  );
  const params = route.params;
  const [informations, setInformations] = useState({});
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const goToNextStage = function (nextStage) {
    if (registerStage === 4) {
      return;
    }
    handleRegisterStage(nextStage);
  };
  const handleInformations = function (info) {
    setInformations({ ...info });
  };

  useEffect(() => {
    if (params.reEnter === true) {
      setSnackbar({
        msg:
          'شما تمام اطلاعات مربوط به پریود خود را حذف کردید، لطفا مجدد اطلاعات پریود خود را وارد کنید',
        visible: true,
      });
    }
  }, []);

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Image
        source={{
          uri:
            settings && registerStage === 0
              ? settings.app_image_field_username.value
              : registerStage === 1
              ? settings.app_image_field_password.value
              : registerStage === 2
              ? settings.app_image_last_period_date.value
              : registerStage === 3
              ? settings.app_image_last_period_length.value
              : settings.app_image_length_between_periods.value,
        }}
        style={{ ...styles.image, backgroundColor: 'rgba(200,200,200, 0.6)' }}
        resizeMode="stretch"
      />

      {registerStage === 0 ? (
        <EnterName
          goToNextStage={goToNextStage}
          setNameAndPicAndBirth={handleInformations}
          editProfile={params.editProfile}
          editName={params.name}
          editPass={params.pass}
          navigation={navigation}
        />
      ) : registerStage === 1 ? (
        <SetPassword nameAndPic={informations} goToNextStage={goToNextStage} />
      ) : (
        <PeriodInfo
          goToNextStage={goToNextStage}
          registerStage={registerStage}
          navigation={navigation}
          displayName={params.reEnter ? params.name : informations.name}
          firstDay={params.firstDay}
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
};

const styles = StyleSheet.create({
  image: {
    width: rw(100),
    height: rh(33),
  },
});

export default EnterInfoScreen;
