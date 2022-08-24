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
      ? { ...styles.plusIconContainer, backgroundColor: COLORS.rossoCorsa }
      : styles.plusIconContainer;
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
              hitSlop={route.name === 'PeriodTabs' ? 22 : 2}
              style={
                route.name === 'Symptoms'
                  ? handlePeriodTabStyles()
                  : { alignItems: 'center' }
              }>
              {options.tabBarIcon({
                tintColor,
                focused,
              })}
              {route.name !== 'LearningBank' && (
                <Text
                  color={COLORS.textLight}
                  small
                  marginLeft={route.name === 'PeriodTabs' ? rw(2) : 0}>
                  {options.title}
                </Text>
              )}
            </Pressable>
          );
        })}
        {/* <View style={handlePeriodTabStyles()}>
          <Image
            source={require('../assets/icons/home/symptoms.png')}
            style={{ width: 30, height: 30 }}
          />
        </View> */}
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
    paddingLeft: rw(4),
  },
  plusIconContainer: {
    width: rw(13.5),
    height: rh(6.5),
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(2),
  },
});

export default TabBar;
