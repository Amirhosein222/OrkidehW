/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, Image, StatusBar, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { PersonalInfo, PeriodInfo } from '../components';
import { BackgroundView, Snackbar } from '../../../components/common';

import { handleInfoLevelsImage } from '../utils/helpers';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { rh, STATUS_BAR_HEIGHT } from '../../../configs';

const EnterInfoScreen = ({ navigation, route }) => {
  const { registerStage, handleRegisterStage, settings } =
    useContext(WomanInfoContext);
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
        msg: 'شما تمام اطلاعات مربوط به پریود خود را حذف کردید، لطفا مجدد اطلاعات پریود خود را وارد کنید',
        visible: true,
        delay: 3000,
      });
      handleRegisterStage(1);
    }
  }, []);

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={styles.content}>
          <Image
            source={handleInfoLevelsImage(registerStage, settings)}
            style={styles.image}
            resizeMode="stretch"
          />

          {registerStage === 0 && (
            <PersonalInfo
              goToNextStage={goToNextStage}
              setNameAndPicAndBirth={handleInformations}
              editProfile={params.editProfile}
              editName={params.name}
              editPass={params.pass}
              navigation={navigation}
            />
          )}
          {registerStage === 1 || registerStage === 2 || registerStage === 3 ? (
            <PeriodInfo
              goToNextStage={goToNextStage}
              registerStage={registerStage}
              navigation={navigation}
              displayName={params.reEnter ? params.name : informations.name}
              firstDay={params.firstDay}
            />
          ) : null}

          {snackbar.visible === true ? (
            <Snackbar
              message={snackbar.msg}
              type={snackbar.type}
              handleVisible={handleVisible}
              delay={snackbar.delay}
            />
          ) : null}
        </View>
      </BackgroundView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginTop: rh(6),
    borderRadius: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: STATUS_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
});

export default EnterInfoScreen;
