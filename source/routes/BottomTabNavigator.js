/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBar } from '../components/common';
import { HomeScreen, SymptomsScreen } from '../screens';

import { MemoryTabs, PeriodTabs } from './TobTabNavigator';

import { COLORS, rh, rw } from '../configs';
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

  const iconsBorderStyle = (focused) => {
    return {
      borderBottomWidth: focused ? 2 : 0,
      paddingBottom: focused ? 5 : 0,
      borderBottomColor: COLORS.textLight,
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
        name="PeriodTabs"
        options={{
          title: 'دلبر',
          tabBarIcon: ({ tintColor, focused }) => (
            <View
              style={[
                handleTabsStyle(focused),
                iconsBorderStyle(focused),
                { marginLeft: rw(4) },
                { marginTop: rw(1) },
              ]}>
              {focused ? (
                <BigSweet style={{ width: 25, height: 25 }} />
              ) : (
                <SmallSweet style={{ width: 25, height: 25 }} />
              )}
            </View>
          ),
        }}
        component={PeriodTabs}
      />
      <Tab.Screen
        name="MemoriesTab"
        options={{
          title: 'خاطرات',
          tabBarIcon: ({ tintColor, focused }) => (
            <View
              style={[
                handleTabsStyle(focused),
                iconsBorderStyle(focused),
                { marginTop: rw(1) },
              ]}>
              {focused ? (
                <BigMem style={{ width: 25, height: 25 }} />
              ) : (
                <SmallMem style={{ width: 25, height: 25 }} />
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
            <View
              style={[
                handleTabsStyle(focused),
                iconsBorderStyle(focused),
                { marginTop: rw(1) },
              ]}>
              {focused ? (
                <BigHome style={{ width: 25, height: 25 }} />
              ) : (
                <SmallHome style={{ width: 25, height: 25 }} />
              )}
            </View>
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Symptoms"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <SympIcon
              style={{
                width: 25,
                height: 25,
                marginTop: rh(1),
                marginLeft: rw(1),
              }}
            />
          ),
        }}
        component={SymptomsScreen}
      />
    </Tab.Navigator>
  );
}
