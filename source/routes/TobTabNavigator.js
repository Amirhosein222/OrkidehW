import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  MyMemoriesScreen,
  AllMemoriesScreen,
  PeriodSymptomsTabScreen,
  SpouseExpectationsTabScreen,
} from '../screens';
import { TopTabBar } from '../components/common';

import { COLORS } from '../configs';

const Tab = createMaterialTopTabNavigator();

export function MemoryTabs() {
  return (
    <Tab.Navigator
      initialRouteName="AllMemories"
      tabBar={(props) => <TopTabBar {...props} />}
      tabBarOptions={{
        activeTintColor: COLORS.pink,
        inactiveTintColor: COLORS.grey,
        indicatorStyle: {
          backgroundColor: COLORS.pink,
        },
        labelStyle: {
          fontFamily: 'Vazir-Bold',
        },
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'خاطرات همه',
        }}
        name="AllMemories"
        component={AllMemoriesScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'خاطرات من',
        }}
        name="MyMemories"
        component={MyMemoriesScreen}
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
        activeTintColor: COLORS.pink,
        inactiveTintColor: COLORS.grey,
        indicatorStyle: {
          backgroundColor: COLORS.pink,
        },
        labelStyle: {
          fontFamily: 'Vazir-Bold',
        },
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'علائم',
        }}
        name="PeriodSymptomsTab"
        component={PeriodSymptomsTabScreen}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'انتظارات از همسر',
        }}
        name="SpouseExpectationsTab"
        component={SpouseExpectationsTabScreen}
      />
    </Tab.Navigator>
  );
}
