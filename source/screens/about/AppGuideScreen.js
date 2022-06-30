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
import { COLORS, STATUS_BAR_HEIGHT } from '../../configs';

const AppGuideScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();

  const [title, setTitle] = useState('');
  return (
    <Container justifyContent="flex-start">
      <StatusBar translucent backgroundColor="transparent" />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + 5, margin: 0 }}
      />
      <View style={styles.container}>
        <FontAwesome5
          name="map-signs"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          size={90}
        />
        <Text medium bold color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}>
          راهنما
        </Text>
        <Divider
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          width="85%"
          style={{ marginTop: 20 }}
        />
        <Text margin="10" medium bold color={COLORS.dark}>
          راهنمای اپلیکیشن راهنمای اپلیکیشن راهنمای اپلیکیشن راهنمای اپلیکیشن
          راهنمای اپلیکیشن راهنمای اپلیکیشن
        </Text>
      </View>
      <TabBar seperate={true} navigation={navigation} />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppGuideScreen;
