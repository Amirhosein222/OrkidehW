/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
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
import { STATUS_BAR_HEIGHT, COLORS } from '../../configs';

const AboutUsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [title, setTitle] = useState('');
  return (
    <Container justifyContent="center">
      <StatusBar translucent backgroundColor="transparent" />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + 5, margin: 0 }}
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
        <Text margin="10" medium color={COLORS.dark}>
          متن تست درباره اپلیکیشن متن تست درباره اپلیکیشن متن تست درباره متن تست
          درباره اپلیکیشن متن تست درباره اپلیکیشن اپلیکیشن متن تست درباره
          اپلیکیشن
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

export default AboutUsScreen;
