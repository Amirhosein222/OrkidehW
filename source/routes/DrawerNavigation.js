import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  ChartScreen,
  SymptomsScreen,
  PostsScreen,
  PsychologyTestsScreen,
  PsychologyTestDetailsScreen,
  ProfileUpdateScreen,
  ContactCounselorScreen,
  ContactSpouseScreen,
  AboutUsScreen,
  AppGuideScreen,
  DevelopersScreen,
  FullPostScreen,
  AddMemoryScreen,
  TestResultScreen,
  LoveNotificationScreen,
  VerifyRelationScreen,
} from '../screens';
import { BottomTabs } from './BottomTabNavigator';

import DrawerUi from '../components/common/DrawerUi';

const Drawer = createDrawerNavigator();

const DrawerNavigator = function () {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      // initialRouteName="LoveNotification"
      drawerContent={(props) => <DrawerUi {...props} />}
      drawerWidth={200}
      drawerContentOptions={{
        activeTintColor: '#ffffff',
        itemsContainerStyle: {
          marginVertical: 0,
        },
        iconContainerStyle: {
          opacity: 1,
        },
      }}>
      <Drawer.Screen name="HomeTabs" component={BottomTabs} />
      <Drawer.Screen name="Charts" component={ChartScreen} />
      <Drawer.Screen name="Symptoms" component={SymptomsScreen} />
      <Drawer.Screen name="Posts" component={PostsScreen} />
      <Drawer.Screen name="FullPost" component={FullPostScreen} />
      <Drawer.Screen name="PsychologyTests" component={PsychologyTestsScreen} />
      <Drawer.Screen name="ProfileUpdate" component={ProfileUpdateScreen} />
      <Drawer.Screen name="ContactSpouse" component={ContactSpouseScreen} />
      <Drawer.Screen name="AboutUs" component={AboutUsScreen} />
      <Drawer.Screen name="AppGuide" component={AppGuideScreen} />
      <Drawer.Screen name="Developers" component={DevelopersScreen} />
      <Drawer.Screen name="AddMemory" component={AddMemoryScreen} />
      <Drawer.Screen
        name="PsychologyTestDetails"
        component={PsychologyTestDetailsScreen}
      />
      <Drawer.Screen name="TestResult" component={TestResultScreen} />
      <Drawer.Screen
        name="ContactCounselor"
        component={ContactCounselorScreen}
      />
      <Drawer.Screen
        name="LoveNotification"
        component={LoveNotificationScreen}
      />
      <Drawer.Screen name="VerifyRelation" component={VerifyRelationScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
