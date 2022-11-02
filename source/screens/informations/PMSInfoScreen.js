/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import { StatusBar, FlatList } from 'react-native';

import { Container, Divider, Text } from '../../components/common';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw } from '../../configs';
import PMSCard from '../../components/periodInfo/PMSCard';

import headache from '../../assets/vectors/charts/headache.png';

const PMSInfoScreen = ({ data }) => {
  const isPeriodDay = useIsPeriodDay();

  const testData = [
    {
      id: 15,
      is_multiple: 0,
      title: 'دفع',
      type: 'woman',
      created_at: 1622671580,
      updated_at: 1622671580,
      image: null,
      aveElseUsers: 1,
      countAuthUser: 4,
    },
    {
      id: 10,
      is_multiple: 0,
      title: 'پوست',
      type: 'woman',
      created_at: 1622671295,
      updated_at: 1622671295,
      image: null,
      aveElseUsers: 1,
      countAuthUser: 2,
    },
    {
      id: 1,
      is_multiple: 1,
      title: 'احساسات',
      type: 'woman',
      created_at: 1666854588,
      updated_at: 1622670634,
      image: '/uploads/photos/1/_____1_20141004_1211342767.jpg',
      aveElseUsers: 1,
      countAuthUser: 7,
    },
    {
      id: 5,
      is_multiple: 0,
      title: 'خواب',
      type: 'woman',
      created_at: 1666854588,
      updated_at: 1622671089,
      image: null,
      aveElseUsers: 1,
      countAuthUser: null,
    },
  ];

  const RenderPms = useCallback(({ item }) => {
    return (
      <PMSCard
        info={{
          title: item.title,
          count: item.countAuthUser,
          image: item.image,
        }}
        icon={headache}
      />
    );
  }, []);

  const RenderPmsDiff = useCallback(({ item }) => {
    return (
      <PMSCard
        info={{
          title: item.title,
          count: item.countAuthUser,
          othersCount: item.aveElseUsers,
          image: item.image,
        }}
        hasBar={true}
        icon={headache}
      />
    );
  }, []);

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

      <FlatList
        data={testData}
        keyExtractor={item => item.id.toString()}
        renderItem={RenderPms}
        numColumns={2}
        contentContainerStyle={{
          marginVertical: rh(1),
          paddingVertical: rh(1),
        }}
      />
      <Divider
        color={isPeriodDay ? COLORS.fireEngineRed : COLORS.textDark}
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
        color={isPeriodDay ? COLORS.fireEngineRed : COLORS.textDark}>
        مقایسه علائم PMS شما و همسالان شما
      </Text>

      <FlatList
        data={data.pmsDiff}
        keyExtractor={item => item.id.toString()}
        renderItem={RenderPmsDiff}
        numColumns={2}
        contentContainerStyle={{
          marginVertical: rh(1),
          paddingVertical: rh(1),
        }}
      />
    </Container>
  );
};

export default PMSInfoScreen;
