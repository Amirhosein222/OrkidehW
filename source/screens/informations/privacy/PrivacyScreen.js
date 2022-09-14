/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import { Image, StyleSheet, Pressable, View, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  PrivacyOption,
  PasswordModal,
  FingerPrintLegacyModal,
} from './components';
import {
  ScreenHeader,
  Divider,
  Text,
  BackgroundView,
  Snackbar,
} from '../../../components/common';

import { COLORS, rh, rw } from '../../../configs';

const PrivacyScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [showFingerModal, setShowFingerModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [biometryType, setBiometryType] = useState(null);
  const [errLegacy, setErrLegacy] = useState('');
  const [passStat, setPassStat] = useState(null);
  const [fingerStat, setFingerStat] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const getMessage = function () {
    if (biometryType === 'Face ID') {
      return 'Scan your Face on the device to continue';
    } else {
      return 'حسگر اثر انگشت را لمس کنید';
    }
  };

  const authCurrent = () => {
    FingerprintScanner.authenticate({
      description: getMessage(),
    })
      .then(async () => {
        FingerprintScanner.release();
        setSnackbar({
          visible: true,
          msg: 'اثر انگشت برای ورود به برنامه فعال شد',
          type: 'success',
        });
        await AsyncStorage.setItem('isFingerActive', 'true');
      })
      .catch((error) => {
        FingerprintScanner.release();
        setFingerStat(false);
      });
  };

  const authLegacy = () => {
    FingerprintScanner.authenticate({
      onAttempt: handleAuthenticationAttemptedLegacy,
    })
      .then(() => {
        console.log('successfully authenticated legacy.');
      })
      .catch((error) => {});
  };

  const handleAuthenticationAttemptedLegacy = (error) => {
    setErrLegacy(error.message);
  };

  const showAuthenticationDialog = function () {
    if (biometryType !== null && biometryType !== undefined) {
      if (requiresLegacyAuthentication()) {
        setShowFingerModal(true);
        authLegacy();
      } else {
        authCurrent();
      }
    } else {
    }
  };

  const requiresLegacyAuthentication = () => {
    return Platform.Version < 23;
  };

  const onClosePassModal = (st) => {
    // on Successful or not pass active....
    setPassStat(st);
    setShowModal(false);
  };

  const handleSwitchDefaultValue = async () => {
    const passStats = await AsyncStorage.getItem('isPassActive');
    const fingerStats = await AsyncStorage.getItem('isFingerActive');
    setPassStat(passStats ? true : false);
    setFingerStat(fingerStats ? true : false);
  };

  useEffect(() => {
    handleSwitchDefaultValue();
  }, []);

  useEffect(() => {
    FingerprintScanner.isSensorAvailable()
      .then((bioType) => {
        setBiometryType(bioType);
      })
      .catch((error) =>
        setSnackbar({
          visible: true,
          msg: 'دستگاه شما از قابلیت اسکن اثر انگشت برخوردار نمی باشد.',
        }),
      );
    return () => {
      FingerprintScanner.release();
    };
  }, []);

  return (
    <BackgroundView>
      <ScreenHeader title="حریم خصوصی" />
      <View style={styles.content}>
        <View style={styles.editMobileContainer}>
          <Pressable onPress={() => navigation.navigate('EditMobile')}>
            <Entypo
              name="chevron-thin-left"
              size={20}
              color={COLORS.textLight}
            />
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text color={COLORS.textDark} textAlign="right" marginRight={rw(3)}>
              تغییر شماره تلفن
            </Text>
            <Image
              source={require('../../../assets/icons/profilePrivacy/ChangeNumber.png')}
              style={{ width: 25, height: 25 }}
            />
          </View>
        </View>
        <Divider
          color={COLORS.textDark}
          width={rw(82)}
          style={{ marginTop: rh(4) }}
          borderWidth={0.6}
        />
        <PrivacyOption
          title="فعال سازی رمز عبور برای ورود به ارکیده"
          handleModal={() => setShowModal(true)}
          type="password"
          modalType={setModalType}
          switchStatus={passStat}
          setSwichStatus={setPassStat}
        />
        <View style={{ width: rw(84), marginTop: rh(2) }}>
          <Text color={COLORS.textLight} textAlign="right" small>
            با فعال سازی رمز عبور برای هربار ورود به برنامه نیاز به وارد کردن
            رمز توسط شماست. ولی همچنان یادآورها روی صفحه برای شما نمایش داده می
            شود
          </Text>
        </View>
        <Divider
          color={COLORS.textDark}
          width={rw(82)}
          style={{ marginTop: rh(4) }}
          borderWidth={0.6}
        />
        <PrivacyOption
          title="فعال سازی  اثر انگشت برای ورود به ارکیده"
          handleModal={showAuthenticationDialog}
          type="finger"
          modalType={setModalType}
          switchStatus={fingerStat}
          setSwichStatus={setFingerStat}
        />
        <View style={{ width: rw(84), marginTop: rh(2) }}>
          <Text color={COLORS.textLight} textAlign="right" small>
            با فعال سازی اثر انگشت برای هربار ورود به برنامه نیاز به وارد کردن
            اثر انگشت شماست. ولی همچنان یادآورها روی صفحه برای شما نمایش داده می
            شود
          </Text>
        </View>
        <Divider
          color={COLORS.textDark}
          width={rw(82)}
          style={{ marginTop: rh(4) }}
          borderWidth={0.6}
        />
        <View style={styles.deleteAcc}>
          <Text color={COLORS.error} marginRight={rw(3)}>
            حذف حساب کاربری
          </Text>
          <Image
            source={require('../../../assets/icons/btns/delete.png')}
            style={{ width: 25, height: 25 }}
          />
        </View>
        {showModal && (
          <PasswordModal
            visible={showModal}
            closeModal={onClosePassModal}
            modalType={modalType}
            handleSnackbar={setSnackbar}
          />
        )}
        {showFingerModal && (
          <FingerPrintLegacyModal
            visible={showFingerModal}
            closeModal={() => setShowFingerModal(false)}
          />
        )}
        {snackbar.visible && (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        )}
      </View>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
    alignItems: 'center',
    width: rw(100),
  },
  editMobileContainer: {
    flexDirection: 'row',
    width: rw(82),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    marginTop: rh(2),
    paddingBottom: rh(4),
  },
  deleteAcc: {
    width: rw(82),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: rh(2),
  },
});

export default PrivacyScreen;
