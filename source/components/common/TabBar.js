/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';

import { COLORS, rh, rw } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';
import Text from './Text';

const TabBar = ({ state, descriptors, navigation }) => {
  const isPeriodDay = useIsPeriodDay();

  const { routes, index } = state;
  const handlePeriodTabStyles = () => {
    return isPeriodDay
      ? { ...styles.plusIconContainer, backgroundColor: COLORS.fireEngineRed }
      : styles.plusIconContainer;
  };

  const textBorderStyle = (focused) => {
    return {
      borderBottomWidth: focused ? 2 : 0,
      paddingBottom: focused ? rh(0.2) : 0,
      borderBottomColor: COLORS.textLight,
    };
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.mainBg,
        justifyContent: 'center',
        width: rw(100),
      }}>
      <View style={styles.container}>
        {routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = index === state.index;
          const tintColor = focused ? '#9b59b6' : '#93a6b4';
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <Pressable
              key={route.key}
              onPress={() => onPress()}
              hitSlop={route.name === 'PartnerMoodsExpsTabs' ? 22 : 2}
              style={
                route.name === 'PeriodTabs'
                  ? handlePeriodTabStyles()
                  : {
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...textBorderStyle(focused),
                    }
              }>
              {options.tabBarIcon({
                tintColor,
                focused,
              })}
              {route.name !== 'LearningBank' && (
                <Text
                  color={COLORS.textLight}
                  size={focused ? 9.5 : 8}
                  marginLeft={
                    route.name === 'PartnerMoodsExpsTabs' ? rw(0) : 0
                  }>
                  {options.title}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.inputTabBarBg,
    width: rw(86),
    height: rh(8.5),
    borderRadius: 40,
    paddingLeft: rw(8),
  },
  plusIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(2),
    paddingTop: rh(0.5),
  },
});

export default TabBar;
