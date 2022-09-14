/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { COLORS, rh, rw } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const PeriodDayTabBar = ({
  state,
  descriptors,
  navigation,
  seperate = false,
  chart = false,
}) => {
  const isPeriodDay = useIsPeriodDay();

  if (seperate) {
    return (
      <View
        style={{
          backgroundColor: chart ? COLORS.lightGrey : COLORS.lightGrey,
        }}>
        <View
          style={{
            ...styles.container,
            backgroundColor: isPeriodDay
              ? COLORS.fireEngineRed
              : COLORS.lightPink,
            width: rw(79),
            // paddingHorizontal: rw(0.5),
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
              source={
                isPeriodDay
                  ? require('../../assets/images/tabIcon1w.png')
                  : require('../../assets/images/tabIcon1.png')
              }
              style={{ marginLeft: 15 }}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Calendar')}>
            <AntDesign
              name="calendar"
              style={{ marginLeft: 15 }}
              color={isPeriodDay ? COLORS.lightWhite : COLORS.grey}
              size={28}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('MemoriesTab')}>
            <Image
              source={
                isPeriodDay
                  ? require('../../assets/images/tabIcon2w.png')
                  : require('../../assets/images/tabIcon2.png')
              }
              style={{ marginLeft: 15 }}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('LearningBank')}>
            <Image
              source={
                isPeriodDay
                  ? require('../../assets/images/tabIcon3w.png')
                  : require('../../assets/images/tabIcon3.png')
              }
              style={{ marginLeft: 15 }}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('PeriodTabs')}>
            <View
              style={[
                styles.plusIconContainer,
                {
                  backgroundColor: isPeriodDay ? COLORS.white : COLORS.primary,
                  marginRight: rw(1),
                },
              ]}>
              <FontAwesome5
                name="plus"
                size={25}
                color={isPeriodDay ? COLORS.fireEngineRed : COLORS.white}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  } else {
    const { routes, index } = state;
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: COLORS.lightGrey,
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
            <TouchableWithoutFeedback key={route.key} onPress={() => onPress()}>
              <View
                style={
                  route.name === 'PeriodTabs'
                    ? {
                        ...styles.plusIconContainer,
                        backgroundColor: COLORS.fireEngineRed,
                      }
                    : {}
                }>
                {options.tabBarIcon({
                  tintColor,
                  focused,
                })}
              </View>
            </TouchableWithoutFeedback>
          );
        })}
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
    width: rw(100),
    height: rh(8),
  },
  plusIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
});

export default PeriodDayTabBar;
