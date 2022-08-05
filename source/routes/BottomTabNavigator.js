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
    marginLeft: rw(3),
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
    }
  };

  const handleTabsStyle = (focused) => {
    return {
      marginLeft: rw(3),
      backgroundColor: isPeriodDay && COLORS.lightGrey,
    };
  };

  const iconsBorderStyle = (focused) => {
    return {
      borderBottomWidth: focused ? 2 : 0,
      paddingBottom: focused ? 5 : 0,
      borderBottomColor: COLORS.expSympReadMore,
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
        name="HomeScreen"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <View
              style={[
                handleTabsStyle(focused),
                iconsBorderStyle(focused),
                {
                  left: rw(1),
                },
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
            <View style={[handleTabsStyle(focused), iconsBorderStyle(focused)]}>
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
      {/* {isPeriodDay && renderPeriodTabIcon(true)} */}

      <Tab.Screen
        name="MemoriesTab"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <View style={[handleTabsStyle(focused), iconsBorderStyle(focused)]}>
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
            <View style={[handleTabsStyle(focused), iconsBorderStyle(focused)]}>
              <Image source={handleIconsColor('bank', focused)} />
            </View>
          ),
        }}
        component={LearningBankScreen}
      />
      <Tab.Screen
        name="PeriodTabs"
        options={{
          tabBarIcon: ({ tintColor, focused }) => (
            <FontAwesome5 name="plus" size={25} color={COLORS.white} />
          ),
        }}
        component={PeriodTabs}
      />
    </Tab.Navigator>
  );
}
