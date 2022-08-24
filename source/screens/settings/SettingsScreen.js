/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Pressable,
  Linking,
} from 'react-native';

import { SettingOption, UserAvatarInfo } from './components';
import {
  ScreenHeader,
  Divider,
  Text,
  ExitModal,
  Snackbar,
  BackgroundView,
} from '../../components/common';
import { baseUrl, COLORS, rh, rw } from '../../configs';
import { useApi } from '../../libs/hooks';
import { buyGoldenAccount } from '../../libs/apiCalls';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

import reminder from '../../assets/icons/drawerSettings/reminder.png';
import relationships from '../../assets/icons/drawerSettings/relationships.png';
import privacy from '../../assets/icons/drawerSettings/privacy.png';
import premiumvVersion from '../../assets/icons/drawerSettings/premium-version.png';
import guide from '../../assets/icons/drawerSettings/guide.png';
import aboutUs from '../../assets/icons/drawerSettings/aboutUs.png';
import inviteFriends from '../../assets/icons/drawerSettings/inviteFriends.png';
import point from '../../assets/icons/drawerSettings/point.png';
import exit from '../../assets/icons/drawerSettings/exit.png';
import share from '../../assets/icons/drawerSettings/share.png';
import copy from '../../assets/icons/drawerSettings/copy.png';

const SettingsScreen = ({ navigation }) => {
  const { fullInfo } = useContext(WomanInfoContext);
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [buyAccount, setBuyAccount] = useApi(() => buyGoldenAccount());

  const onBuyAccount = async () => {
    setBuyAccount();
  };

  const handleExitModal = function () {
    setShowModal(!showModal);
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  useEffect(() => {
    if (buyAccount.data) {
      buyAccount.data.is_successful
        ? Linking.openURL(buyAccount.data.data.action)
        : setSnackbar({
            msg: buyAccount.data.message,
            visible: true,
            type: 'error',
          });
    }
  }, [buyAccount]);

  return (
    <BackgroundView>
      <ScreenHeader title="تنظیمات" />
      <ScrollView contentContainerStyle={styles.content}>
        <UserAvatarInfo
          picture={fullInfo.image ? baseUrl + fullInfo.image : ''}
        />
        <Divider
          color={COLORS.textDark}
          width="82%"
          style={{ marginTop: rh(2) }}
        />
        <SettingOption
          title="سیکل قاعدگی"
          icon="cycle"
          name="cycles"
          navigateTo="Cycles"
        />
        <SettingOption
          title="یادآورها"
          icon={reminder}
          name="default"
          navigateTo="Reminders"
        />
        <SettingOption
          title="حریم خصوصی"
          icon={privacy}
          name="default"
          navigateTo="Privacy"
        />
        <SettingOption
          title="روابط من"
          icon={relationships}
          name="default"
          navigateTo="Relations"
        />
        <Divider
          color={COLORS.textDark}
          width="82%"
          style={{ marginTop: rh(2) }}
        />
        <SettingOption
          title="خرید نسخه کامل برنامه"
          icon={premiumvVersion}
          name="vip"
          onBuyAccount={onBuyAccount}
          isFetching={buyAccount.isFetching}
        />
        <SettingOption
          title="راهنما"
          icon={guide}
          name="guide"
          navigateTo="AppGuide"
        />
        <SettingOption
          title="درباره ارکیده"
          icon={aboutUs}
          name="about"
          navigateTo="AboutUs"
        />
        <Divider
          color={COLORS.textDark}
          width="82%"
          style={{ marginTop: rh(2) }}
        />
        <SettingOption title="امتیاز به ارکیده" icon={point} />
        <SettingOption
          title="دعوت دوستان"
          icon={inviteFriends}
          name="invite"
          handleVisible={setSnackbar}
        />
        <Divider
          color={COLORS.textDark}
          width="82%"
          style={{ marginTop: rh(2) }}
        />
        <Pressable onPress={handleExitModal}>
          <SettingOption title="خروج از حساب کاربری" icon={exit} name="exit" />
        </Pressable>

        <Image
          source={require('../../assets/images/orkideh-logo.png')}
          style={styles.image}
        />
        <Text marginTop={rh(1)} color={COLORS.textLight}>
          نسخه 0.0.2
        </Text>
      </ScrollView>
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
          delay={3000}
        />
      ) : null}
      <ExitModal
        visible={showModal}
        navigation={navigation}
        closeModal={handleExitModal}
      />
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
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    marginTop: rh(2),
    paddingBottom: rh(4),
  },
  image: {
    width: rw(30),
    height: rh(12),
    marginTop: rh(2),
  },
});

export default SettingsScreen;
