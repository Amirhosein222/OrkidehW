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
  WelcomeScreen,
  ProfileScreen,
  CyclesScreen,
  PrivacyScreen,
  RemindersScreen,
  EditMobileScreen,
  RelationsScreen,
  AddRelScreen,
  UpdateRelScreen,
} from '../screens';

import DrawerNavigator from './DrawerNavigation';
import { ActivityIndicator } from 'react-native';
import { COLORS } from '../configs';

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
      fallback={
        <ActivityIndicator
          color={COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
          size="large"
        />
      }>
      <Stack.Navigator
        headerMode="none"
        initialRouteName={isLoggedin ? 'HomeDrawer' : 'Register'}>
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
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SetAlarm" component={SetAlarmScreen} />
        <Stack.Screen name="PMSInfo" component={PMSInfoScreen} />
        <Stack.Screen name="Symptoms" component={SymptomsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Cycles" component={CyclesScreen} />
        <Stack.Screen name="Reminders" component={RemindersScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="EditMobile" component={EditMobileScreen} />
        <Stack.Screen name="Relations" component={RelationsScreen} />
        <Stack.Screen name="AddRel" component={AddRelScreen} />
        <Stack.Screen name="UpdateRel" component={UpdateRelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
