/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { TabBar } from '../components/common';
import { HomeScreen, CalendarScreen, LearningBankScreen } from '../screens';

import { MemoryTabs, PeriodTabs } from './TobTabNavigator';

import { COLORS, rh, rw } from '../configs';
import { WomanInfoContext } from '../libs/context/womanInfoContext';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const { isPeriodDay } = useContext(WomanInfoContext);
  const periodDayStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    width: rw(9.5),
    height: rh(4.5),
  };
  const handleIconsColor = (icon, focused) => {
    if (isPeriodDay) {
      switch (icon) {
        case 'home':
          return require('../assets/images/tabIcon1.png');
        case 'calendar':
          return COLORS.grey;
        case 'memories':
          return require('../assets/images/tabIcon2.png');
        case 'bank':
          return require('../assets/images/tabIcon3.png');
        default:
          break;
      }
    } else {
      switch (icon) {
        case 'home':
          return focused
            ? require('../assets/images/tabIcon1p.png')
            : require('../assets/images/tabIcon1.png');
        case 'calendar':
          return focused ? COLORS.pink : COLORS.grey;
        case 'memories':
          return focused
            ? require('../assets/images/tabIcon2p.png')
            : require('../assets/images/tabIcon2.png');
        case 'bank':
          return focused
            ? require('../assets/images/tabIcon3p.png')
            : require('../assets/images/tabIcon3.png');
        default:
          break;
      }
    }
  };

  const renderPeriodTabIcon = (atPeriod = false) => (
    <Tab.Screen
      name="PeriodTabs"
      options={{
        tabBarIcon: ({ tintColor, focused }) => (
          <FontAwesome5 name="plus" size={25} color={COLORS.white} />
        ),
      }}
      component={PeriodTabs}
    />
  );

  const handleTabsStyle = (focused) => {
    if (isPeriodDay) {
      return {
        ...periodDayStyle,
        backgroundColor: focused ? COLORS.rossoCorsa : COLORS.lightGrey,
      };
    } else {
      return { marginLeft: rw(3) };
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      backBehavior="none"
      tabBar={(props) => <TabBar {...props} />}
      swipeEnabled={false}
      animationEnabled={false}
      tabBarOptions={{
        showIcon: true,
        showLabel: true,
        upperCaseLabel: false,
      }}>
      <Tab.Screen
        name="HomeScreen"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <View
              style={[
                handleTabsStyle(focused),
                { left: isPeriodDay ? rw(3) : rw(1) },
              ]}>
              <Image source={handleIconsColor('home', focused)} />
            </View>
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Calendar"
        initialParams={{ updateCal: false }}
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <View
              style={[
                handleTabsStyle(focused),
                { right: isPeriodDay ? rw(1.1) : 0 },
              ]}>
              <AntDesign
                name="calendar"
                color={handleIconsColor('calendar', focused)}
                size={28}
              />
            </View>
          ),
        }}
        component={CalendarScreen}
      />
      {isPeriodDay && renderPeriodTabIcon(true)}

      <Tab.Screen
        name="MemoriesTab"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <View
              style={[
                handleTabsStyle(focused),
                { left: isPeriodDay ? rw(3) : 0 },
              ]}>
              <Image source={handleIconsColor('memories', focused)} />
            </View>
          ),
        }}
        component={MemoryTabs}
      />
      <Tab.Screen
        name="LearningBank"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <View
              style={[
                handleTabsStyle(focused),
                {
                  right: isPeriodDay ? rw(2) : 0,
                },
              ]}>
              <Image source={handleIconsColor('bank', focused)} />
            </View>
          ),
        }}
        component={LearningBankScreen}
      />
      {!isPeriodDay && renderPeriodTabIcon()}
    </Tab.Navigator>
  );
}
