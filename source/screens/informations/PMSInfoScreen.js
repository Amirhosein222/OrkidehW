/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
  Container,
  Divider,
  Text,
  Image,
  RowContainer,
} from '../../components/common';
import { Bars } from '../../components/charts';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw } from '../../configs';
import PMSCard from '../../components/periodInfo/PMSCard';

import muscleten from '../../assets/vectors/charts/muscleten.png';
import backpain from '../../assets/vectors/charts/backpain.png';
import headache from '../../assets/vectors/charts/headache.png';
import dep from '../../assets/vectors/charts/dep.png';

const PMSInfoScreen = ({}) => {
  const isPeriodDay = useIsPeriodDay();
  return (
    <Container
      justifyContent="flex-start"
      bgColor="transparent"
      marginTop={rh(2)}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Text color={COLORS.textDark} bold>
        اطلاعات PMS در شش دوره اخیر شما
      </Text>

      <View
        style={{
          flexDirection: 'row',
          width: rw(84),
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
          marginVertical: rh(2),
        }}>
        <PMSCard info={{ title: 'سردرد', count: 3 }} icon={headache} />
        <PMSCard info={{ title: 'حس افسردگی', count: 2 }} icon={dep} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: rw(84),
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
          marginVertical: rh(2),
        }}>
        <PMSCard
          info={{ title: 'درد کمر، پا، دست یا زانو', count: 4 }}
          icon={backpain}
        />
        <PMSCard info={{ title: 'گرفتگی ماهیچه', count: 2 }} icon={muscleten} />
      </View>
      <Divider
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textDark}
        width={rw(82)}
        style={{
          marginTop: 5,
          alignSelf: 'center',
          borderBottomWidth: 0.7,
        }}
      />
      <Text
        alignSelf="center"
        marginRight="20"
        marginTop="20"
        bold
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textDark}>
        مقایسه علائم PMS شما و همسالان شما
      </Text>

      <View
        style={{
          flexDirection: 'row',
          width: rw(85),
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
          marginVertical: rh(2),
        }}>
        <PMSCard
          info={{ title: 'سردرد', count: 3 }}
          hasBar={true}
          icon={headache}
        />
        <PMSCard
          info={{ title: 'حس افسردگی', count: 2 }}
          hasBar={true}
          icon={dep}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: rw(87),
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
          marginVertical: rh(2),
        }}>
        <PMSCard
          info={{ title: 'درد کمر، پا، دست یا زانو', count: 4 }}
          icon={backpain}
          hasBar={true}
        />
        <PMSCard
          info={{ title: 'گرفتگی ماهیچه', count: 2 }}
          hasBar={true}
          icon={muscleten}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  imgContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pmsInfoCont: {
    margin: 5,
  },
});

export default PMSInfoScreen;
