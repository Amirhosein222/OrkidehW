/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { Image, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import { TabBar } from '../components/common';
import { HomeScreen, LearningBankScreen, SymptomsScreen } from '../screens';

import { MemoryTabs, PeriodTabs } from './TobTabNavigator';

import { COLORS, rh, rw } from '../configs';
import { WomanInfoContext } from '../libs/context/womanInfoContext';

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
              <Image
                source={
                  focused
                    ? require('../assets/icons/home/big-sweetheart.png')
                    : require('../assets/icons/home/small-sweetheart.png')
                }
                style={{ width: 28, height: 28 }}
              />
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
              <Image
                source={
                  focused
                    ? require('../assets/icons/home/big-memories.png')
                    : require('../assets/icons/home/small-memories.png')
                }
                style={{ width: 28, height: 28 }}
              />
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
              <Image
                source={
                  focused
                    ? require('../assets/icons/home/big-home.png')
                    : require('../assets/icons/home/small-home.png')
                }
                style={{ width: 28, height: 28 }}
              />
            </View>
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Symptoms"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <Image
              source={require('../assets/icons/home/symptoms.png')}
              style={{
                width: 28,
                height: 28,
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
