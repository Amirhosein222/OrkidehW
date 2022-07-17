/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  Text,
  Divider,
  IconWithBg,
  Switch,
} from '../../components/common';

import { COLORS, WIDTH } from '../../configs';

const SetAlarmScreen = ({}) => {
  const [sound, setSound] = useState(false);
  const [notif, setNotif] = useState(false);
  const [notifColor, setNotifColor] = useState(false);

  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <IconWithBg
        bgColor={COLORS.pink}
        width="30px"
        height="30px"
        borderRadius="20px"
        icon="chevron-left"
        iconSize={30}
        marginTop="20px"
        marginLeft="20px"
        alignSelf="flex-start"
      />
      <Divider color={COLORS.pink} width="80%" style={{ margin: 20 }} />
      <Text marginTop="10" small>
        صدای دریافت و ارسال هشدار
      </Text>
      <Switch active={sound} changeStatus={setSound} />
      <Text marginTop="10" small>
        اعلان ها
      </Text>
      <Switch active={notif} changeStatus={setNotif} />
      <Text marginTop="10" small>
        رنگ اعلان ها
      </Text>
      <Switch active={notifColor} changeStatus={setNotifColor} />
      <Divider color={COLORS.pink} width="80%" style={{ marginTop: 20 }} />
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: 250,
  },
  passInput: {
    borderRadius: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
    borderWidth: 1,
    margin: 5,
    color: COLORS.grey,
  },
  checkBox: {
    alignItems: 'center',
  },
  btn: {
    width: '45%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default SetAlarmScreen;
