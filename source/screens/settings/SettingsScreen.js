/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import { StyleSheet, ScrollView, Image, Pressable } from 'react-native';

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
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

import Reminder from '../../assets/icons/drawerSettings/reminder.svg';
import Relationships from '../../assets/icons/drawerSettings/relationships.svg';
import Privacy from '../../assets/icons/drawerSettings/privacy.svg';
import Guide from '../../assets/icons/drawerSettings/guide.svg';
import AboutUs from '../../assets/icons/drawerSettings/aboutUs.svg';
import InviteFriends from '../../assets/icons/drawerSettings/inviteFriends.svg';
import Point from '../../assets/icons/drawerSettings/point.svg';
import Exit from '../../assets/icons/drawerSettings/exit.svg';

const SettingsScreen = ({ navigation }) => {
  const { fullInfo } = useContext(WomanInfoContext);
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleExitModal = function () {
    setShowModal(!showModal);
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  return (
    <BackgroundView>
      <ScreenHeader title="تنظیمات" />
      <ScrollView contentContainerStyle={styles.content}>
        <UserAvatarInfo
          picture={fullInfo.image ? baseUrl + fullInfo.image : ''}
        />
        <Divider
          color={COLORS.textDark}
          width={rw(77)}
          borderWidth={0.5}
          style={{ marginBottom: rh(1), marginTop: rh(3) }}
        />
        <SettingOption
          title="سیکل قاعدگی"
          icon="cycle"
          name="cycles"
          navigateTo="Cycles"
        />
        <SettingOption
          title="یادآورها"
          Icon={() => <Reminder style={{ width: 25, height: 25 }} />}
          name="default"
          navigateTo="Reminders"
        />
        <SettingOption
          title="حریم خصوصی"
          Icon={() => <Privacy style={{ width: 25, height: 25 }} />}
          name="default"
          navigateTo="Privacy"
        />
        <SettingOption
          title="روابط من"
          Icon={() => <Relationships style={{ width: 25, height: 25 }} />}
          name="default"
          navigateTo="Relations"
        />
        <Divider
          color={COLORS.textDark}
          width={rw(77)}
          borderWidth={0.5}
          style={{ marginVertical: rh(1.5) }}
        />
        <SettingOption
          title="راهنما"
          Icon={() => <Guide style={{ width: 25, height: 25 }} />}
          name="guide"
          navigateTo="AppGuide"
        />
        <SettingOption
          title="درباره ارکیده"
          Icon={() => <AboutUs style={{ width: 25, height: 25 }} />}
          name="about"
          navigateTo="AboutUs"
        />
        <Divider
          color={COLORS.textDark}
          width={rw(77)}
          borderWidth={0.5}
          style={{ marginVertical: rh(1.5) }}
        />
        <SettingOption
          title="امتیاز به ارکیده"
          Icon={() => <Point style={{ width: 25, height: 25 }} />}
        />
        <SettingOption
          title="دعوت دوستان"
          Icon={() => <InviteFriends style={{ width: 25, height: 25 }} />}
          name="invite"
          handleVisible={setSnackbar}
        />
        <Divider
          color={COLORS.textDark}
          width={rw(77)}
          borderWidth={0.5}
          style={{ marginTop: rh(2) }}
        />
        <Pressable onPress={handleExitModal}>
          <SettingOption
            title="خروج از حساب کاربری"
            Icon={() => <Exit style={{ width: 25, height: 25 }} />}
            name="exit"
          />
        </Pressable>

        <Image
          source={require('../../assets/images/orkideh-logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text marginBottom={rh(3)} color={COLORS.textLight}>
          نسخه 0.0.3
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: rw(100),
    marginTop: rh(2),
  },
  image: {
    width: rw(31),
    height: rh(12),
    marginTop: rh(2),
    marginBottom: rh(1),
  },
});

export default SettingsScreen;
