/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  Divider,
  ScreenHeader,
  BackgroundView,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw } from '../../configs';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

const AboutUsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const { settings } = useContext(WomanInfoContext);
  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScreenHeader title="درباره ارکیده" />
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="google-circles-extended"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.icon}
          size={90}
        />
        <Text
          medium
          bold
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textlIGHT}>
          درباره اپلیکیشن
        </Text>
        <Divider
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textDark}
          width="85%"
          style={{ marginTop: 20 }}
        />
        <View style={{ paddingHorizontal: rw(3), marginTop: rh(1) }}>
          <Text marginRight={rw(4)} color={COLORS.textDark} textAlign="right">
            {settings.app_text_about_us_page.value}
          </Text>
        </View>
      </View>
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: rh(3),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AboutUsScreen;
