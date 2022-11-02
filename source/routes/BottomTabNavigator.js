/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBar } from '../components/common';
import { HomeScreen } from '../screens';

import {
  MemoryTabs,
  PeriodTabs,
  PartnerMoodsExpsTabs,
} from './TobTabNavigator';

import {
  COLORS,
  rh,
  rw,
  TAB_BIG_ICON_SIZE,
  TAB_SMALL_ICON_SIZE,
} from '../configs';
import { WomanInfoContext } from '../libs/context/womanInfoContext';

import BigSweet from '../assets/icons/home/big-sweetheart.svg';
import SmallSweet from '../assets/icons/home/small-sweetheart.svg';
import BigMem from '../assets/icons/home/big-memories.svg';
import SmallMem from '../assets/icons/home/small-memories.svg';
import BigHome from '../assets/icons/home/big-home.svg';
import SmallHome from '../assets/icons/home/small-home.svg';
import SympIcon from '../assets/icons/home/symptoms.svg';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const { isPeriodDay } = useContext(WomanInfoContext);

  const handleTabsStyle = (focused) => {
    return {
      backgroundColor: isPeriodDay && COLORS.lightGrey,
    };
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
        name="PartnerMoodsExpsTabs"
        options={{
          title: 'دلبر',
          tabBarIcon: ({ tintColor, focused }) => (
            <View
              style={[
                handleTabsStyle(focused),
                { marginLeft: rw(0) },
                { marginTop: rw(1) },
              ]}>
              {focused ? (
                <BigSweet style={TAB_BIG_ICON_SIZE} />
              ) : (
                <SmallSweet style={TAB_SMALL_ICON_SIZE} />
              )}
            </View>
          ),
        }}
        component={PartnerMoodsExpsTabs}
      />
      <Tab.Screen
        name="MemoriesTab"
        options={{
          title: 'خاطرات',
          tabBarIcon: ({ tintColor, focused }) => (
            <View style={[handleTabsStyle(focused), { marginTop: rw(1) }]}>
              {focused ? (
                <BigMem style={TAB_BIG_ICON_SIZE} />
              ) : (
                <SmallMem style={TAB_SMALL_ICON_SIZE} />
              )}
            </View>
          ),
        }}
        component={MemoryTabs}
      />
      <Tab.Screen
        name="HomeScreen"
        options={{
          title: 'خانه',
          tabBarIcon: ({ tintColor, focused }) => (
            <View style={[handleTabsStyle(focused), { marginTop: rw(1) }]}>
              {focused ? (
                <BigHome style={TAB_BIG_ICON_SIZE} />
              ) : (
                <SmallHome style={TAB_SMALL_ICON_SIZE} />
              )}
            </View>
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="PeriodTabs"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <SympIcon
              style={{
                width: rw(7.5),
                height: rh(4.2),
                marginTop: rh(1.1),
                marginLeft: rw(1),
              }}
            />
          ),
        }}
        component={PeriodTabs}
      />
    </Tab.Navigator>
  );
}
