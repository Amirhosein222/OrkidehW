import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  LoginScreen,
  RegisterScreen,
  VerificationScreen,
  SetAlarmScreen,
  SymptomsScreen,
  PMSInfoScreen,
  EnterInfoScreen,
} from '../screens';

import DrawerNavigator from './DrawerNavigation';
import { ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['orkidehw://'],
  config: {
    initialRouteName: 'Login',
    screens: {
      HomeDrawer: {
        screens: {
          HomeTabs: {
            screens: {
              HomeScreen: 'home/:refresh',
            },
          },
        },
      },
      // Details: {
      //   path: 'details/:personId',
      // },
    },
  },
};

export default function MainStackNavigator({ isLoggedin }) {
  return (
    <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator color="blue" size="large" />}>
      <Stack.Navigator
        headerMode="none"
        initialRouteName={isLoggedin ? 'HomeDrawer' : 'Login'}>
        <Stack.Screen name="HomeDrawer" component={DrawerNavigator} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          initialParams={{ editNumber: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen
          name="EnterInfo"
          component={EnterInfoScreen}
          initialParams={{ editProfile: false, reEnter: false }}
        />

        <Stack.Screen name="SetAlarm" component={SetAlarmScreen} />
        <Stack.Screen name="PMSInfo" component={PMSInfoScreen} />
        <Stack.Screen name="Symptoms" component={SymptomsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
