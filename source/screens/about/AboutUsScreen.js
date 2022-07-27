/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Container,
  Text,
  Divider,
  TabBar,
  Header,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { STATUS_BAR_HEIGHT, COLORS, rh, rw } from '../../configs';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

const AboutUsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const { settings } = useContext(WomanInfoContext);
  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
      />
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="google-circles-extended"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          size={90}
        />
        <Text medium bold color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          درباره اپلیکیشن
        </Text>
        <Divider
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          width="85%"
          style={{ marginTop: 20 }}
        />
        <View style={{ paddingHorizontal: rw(3), marginTop: rh(1) }}>
          <Text
            marginRight={rw(3)}
            medium
            color={COLORS.dark}
            textAlign="right">
            {settings.app_text_about_us_page.value}
          </Text>
        </View>
      </View>
      <TabBar seperate={true} navigation={navigation} />
    </Container>
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
