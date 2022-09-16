import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  MyGapsScreen,
  AllGapsScreen,
  PeriodSymptomsTabScreen,
  SpouseExpectationsTabScreen,
} from '../screens';
import { TopTabBar } from '../components/common';

import { COLORS } from '../configs';

const Tab = createMaterialTopTabNavigator();

export function MemoryTabs() {
  return (
    <Tab.Navigator
      initialRouteName="AllGaps"
      tabBar={(props) => <TopTabBar {...props} />}
      tabBarOptions={{
        contentContainerStyle: {
          backgroundColor: 'red',
          width: '100%',
        },
        activeTintColor: COLORS.primary,
        inactiveTintColor: COLORS.grey,
        indicatorStyle: {
          backgroundColor: COLORS.primary,
        },
        labelStyle: {
          fontFamily: 'IRANYekanMobileBold',
        },
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'گپ',
        }}
        name="AllGaps"
        component={AllGapsScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'گپ های من',
        }}
        name="MyGaps"
        component={MyGapsScreen}
      />
    </Tab.Navigator>
  );
}

export function PeriodTabs() {
  return (
    <Tab.Navigator
      initialRouteName="PeriodSymptomsTab"
      tabBar={(props) => <TopTabBar {...props} />}
      tabBarOptions={{
        activeTintColor: COLORS.primary,
        inactiveTintColor: COLORS.textLight,
        indicatorStyle: {
          backgroundColor: COLORS.primary,
        },
        labelStyle: {
          fontFamily: 'IRANYekanMobileBold',
        },
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'حال و احوالت توی این روز چطوره؟',
        }}
        name="PeriodSymptomsTab"
        component={PeriodSymptomsTabScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'همسرت چیکار کنه خوشحال بشی؟',
        }}
        name="SpouseExpectationsTab"
        component={SpouseExpectationsTabScreen}
      />
    </Tab.Navigator>
  );
}
