/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  Container,
  Text,
  Divider,
  TabBar,
  Header,
} from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, STATUS_BAR_HEIGHT } from '../../configs';

const DevelopersScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();

  return (
    <Container justifyContent="flex-start">
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
        <FontAwesome5
          name="laptop-code"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          size={90}
        />
        <Text medium bold color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          سازندگان اپلیکیشن
        </Text>
        <Divider
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          width="85%"
          style={{ marginTop: 20 }}
        />
        <Text marginTop="20" medium bold color={COLORS.dark}>
          شرکت توسعه نرم افزار موازی پرداز
        </Text>
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

export default DevelopersScreen;
