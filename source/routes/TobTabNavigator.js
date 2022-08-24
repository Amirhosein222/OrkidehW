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
          fontFamily: 'Qs_Iranyekan_bold',
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
        activeTintColor: COLORS.primary,
        inactiveTintColor: COLORS.textLight,
        indicatorStyle: {
          backgroundColor: COLORS.primary,
        },
        labelStyle: {
          fontFamily: 'Qs_Iranyekan_bold',
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
