/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'react-native';

import { Container, Image, Snackbar } from '../../components/common';
import {
  EnterName,
  PeriodInfo,
  SetPassword,
} from '../../components/informations';
import { rw } from '../../configs';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';

const EnterInfoScreen = ({ navigation, route }) => {
  const { registerStage, handleRegisterStage } = useContext(WomanInfoContext);
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
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        imageSource={
          registerStage === 0
            ? require('../../assets/images/27031.png')
            : registerStage === 1
            ? require('../../assets/images/122.png')
            : registerStage === 2
            ? require('../../assets/images/166.png')
            : registerStage === 3
            ? require('../../assets/images/144.png')
            : require('../../assets/images/3237324.png')
        }
        width={rw(100)}
        height="270px"
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

export default EnterInfoScreen;
