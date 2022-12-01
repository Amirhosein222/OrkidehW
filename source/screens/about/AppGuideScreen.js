/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { StatusBar, StyleSheet, View, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  Text,
  Divider,
  ScreenHeader,
  BackgroundView,
} from '../../components/common';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw } from '../../configs';

const AppGuideScreen = ({ navigation }) => {
  const { settings } = useContext(WomanInfoContext);
  const isPeriodDay = useIsPeriodDay();

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScreenHeader title="راهنما" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: rh(1) }}>
        <View style={styles.container}>
          <FontAwesome5
            name="map-signs"
            color={isPeriodDay ? COLORS.periodDay : COLORS.icon}
            size={90}
          />
          <Text
            medium
            bold
            color={isPeriodDay ? COLORS.periodDay : COLORS.textLight}>
            راهنما
          </Text>
          <Divider
            color={isPeriodDay ? COLORS.periodDay : COLORS.textDark}
            width="85%"
            style={{ marginTop: 20 }}
          />
          <View style={{ paddingHorizontal: rw(4), marginTop: rh(1) }}>
            <Text marginRight={rw(3)} color={COLORS.textDark} textAlign="right">
              {settings.app_text_help_page.value}
            </Text>
          </View>
        </View>
      </ScrollView>
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

export default AppGuideScreen;
