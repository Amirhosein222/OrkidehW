import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  ChartScreen,
  SymptomsScreen,
  PostsScreen,
  PsychologyTestsScreen,
  PsychologyTestDetailsScreen,
  ContactCounselorScreen,
  AboutUsScreen,
  AppGuideScreen,
  FullPostScreen,
  LoveNotificationScreen,
  SettingsScreen,
  EditCyclesScreen,
  MagazineScreen,
} from '../screens';
import { BottomTabs } from './BottomTabNavigator';

import DrawerUi from '../components/common/DrawerUi';

const Drawer = createDrawerNavigator();

const DrawerNavigator = function () {
  return (
    <Drawer.Navigator
      edgeWidth={0}
      drawerPosition="right"
      drawerContent={props => <DrawerUi {...props} />}
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
      <Drawer.Screen name="AboutUs" component={AboutUsScreen} />
      <Drawer.Screen name="AppGuide" component={AppGuideScreen} />
      <Drawer.Screen
        name="PsychologyTestDetails"
        component={PsychologyTestDetailsScreen}
      />
      <Drawer.Screen
        name="ContactCounselor"
        component={ContactCounselorScreen}
      />
      <Drawer.Screen
        name="LoveNotification"
        component={LoveNotificationScreen}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="EditCycles" component={EditCyclesScreen} />
      <Drawer.Screen name="Magazine" component={MagazineScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
