/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Image, StyleSheet, Pressable, View, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import { PrivacyOption, PasswordFingerModal } from './components';
import {
  ScreenHeader,
  Divider,
  Text,
  BackgroundView,
} from '../../../components/common';

import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { baseUrl, COLORS, rh, rw } from '../../../configs';

const PrivacyScreen = ({ navigation }) => {
  const { fullInfo } = useContext(WomanInfoContext);
  const [reminderText, setReminderText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [biometryType, setBiometryType] = useState(null);

  const getMessage = function () {
    if (biometryType === 'Face ID') {
      return 'Scan your Face on the device to continue';
    } else {
      return 'انگشت خود را بر روی حسگر اثر انگشت گوشی خود قرار دهید.';
    }
  };

  const showAuthenticationDialog = function () {
    if (biometryType !== null && biometryType !== undefined) {
      FingerprintScanner.authenticate({
        description: getMessage(),
      })
        .then(() => {
          AsyncStorage.setItem('logedOut', 'false');
        })
        .catch((error) => {
          // console.log('Authentication error is => ', error);
        });
    } else {
      // console.log('biometric authentication is not available');
    }
  };

  useEffect(() => {
    FingerprintScanner.isSensorAvailable()
      .then((bioType) => {
        setBiometryType(bioType);
      })
      .catch((error) =>
        Alert.alert(
          'خطا',
          'دستگاه شما از قابلیت اسکن اثر انگشت برخوردار نمی باشد.',
        ),
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
          handleModal={setShowModal}
          type="pass"
          modalType={setModalType}
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
          <PasswordFingerModal
            visible={showModal}
            closeModal={() => setShowModal(false)}
            modalType={modalType}
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
