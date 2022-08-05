/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { COLORS, rh, rw } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const TabBar = ({
  state,
  descriptors,
  navigation,
  seperate = false,
  chart = false,
}) => {
  const isPeriodDay = useIsPeriodDay();

  const renderPriodTabIcon = (atPeriod = false) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('PeriodTabs')}>
        <View
          style={
            isPeriodDay
              ? {
                  ...styles.plusIconContainer,
                  backgroundColor: COLORS.rossoCorsa,
                }
              : { ...styles.plusIconContainer }
          }>
          <FontAwesome5 name="plus" size={25} color={COLORS.white} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  if (seperate) {
    return (
      <View style={{ backgroundColor: chart ? COLORS.white : 'white' }}>
        <View
          style={{
            ...styles.container,
            backgroundColor: isPeriodDay ? COLORS.lightGrey : COLORS.tabBarBg,
            paddingHorizontal: rw(2),
            width: rw(86),
            height: rh(8.2),
            borderRadius: 40,
          }}>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'HomeDrawer' }],
                }),
              )
            }>
            <Image
              style={{ left: rw(4) }}
              source={require('../../assets/images/tabIcon1.png')}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Calendar')}>
            <AntDesign
              style={{
                left: rw(3),
              }}
              name="calendar"
              color={COLORS.grey}
              size={28}
            />
          </TouchableWithoutFeedback>

          {/* {isPeriodDay && renderPriodTabIcon(true, true)} */}
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('MemoriesTab')}>
            <Image
              source={require('../../assets/images/tabIcon2.png')}
              style={{
                left: rw(3),
              }}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('LearningBank')}>
            <Image
              source={require('../../assets/images/tabIcon3.png')}
              style={{
                left: rw(3),
              }}
            />
          </TouchableWithoutFeedback>

          {renderPriodTabIcon()}
        </View>
      </View>
    );
  } else {
    const { routes, index } = state;
    const handlePeriodTabStyles = () => {
      return isPeriodDay
        ? { ...styles.plusIconContainer, backgroundColor: COLORS.rossoCorsa }
        : styles.plusIconContainer;
    };
    return (
      <View style={{ backgroundColor: 'white' }}>
        <View
          style={{
            ...styles.container,
            backgroundColor: COLORS.tabBarBg,
            width: rw(86),
            height: rh(8.2),
            borderRadius: 40,
            paddingHorizontal: rw(2),
          }}>
          {routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const focused = index === state.index;
            const tintColor = focused ? '#9b59b6' : '#93a6b4';
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };
            return (
              <Pressable
                key={route.key}
                onPress={() => onPress()}
                hitSlop={route.name === 'PeriodTabs' ? 22 : 2}
                style={
                  route.name === 'PeriodTabs' ? handlePeriodTabStyles() : {}
                }>
                {options.tabBarIcon({
                  tintColor,
                  focused,
                })}
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: COLORS.lightPink,
    marginBottom: 10,
  },
  peridoTabPDayStyle: {
    backgroundColor: COLORS.rossoCorsa,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    // ...StyleSheet.absoluteFillObject,
    // top: rh(-4),
    // left: rw(44),
    width: rw(18),
    height: rh(8),
  },
  plusIconContainer: {
    width: rw(13.5),
    height: rh(6.5),
    borderRadius: 30,
    backgroundColor: COLORS.plusIconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
  },
});

export default TabBar;
