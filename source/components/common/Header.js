/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import { WomanInfoContext } from '../../libs/context/womanInfoContext';
import { IconWithBg } from './index';
import { COLORS } from '../../configs';

const Header = ({ navigation, style }) => {
  const { isPeriodDay } = useContext(WomanInfoContext);
  return (
    <View style={[styles.container, { ...style }]}>
      <View style={styles.heartIcon}>
        <Pressable onPress={() => navigation.navigate('Symptoms')}>
          <IconWithBg
            bgColor={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
            width="40px"
            height="40px"
            borderRadius="30px"
            icon="heart"
            iconSize={25}
            alignSelf="center"
            marginLeft="20px"
          />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('ContactCounselor')}>
          <Feather
            name="phone"
            color={COLORS.grey}
            size={25}
            style={{ marginLeft: 5 }}
          />
        </Pressable>
      </View>
      <Pressable onPress={() => navigation.openDrawer()}>
        <MaterialCommunityIcons
          name="menu"
          color={COLORS.grey}
          size={28}
          style={{ marginRight: 20 }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    width: '100%',
    margin: 20,
    height: 50,
  },
  heartIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
  },
  btn: {
    width: '45%',
    height: 40,
    borderRadius: 20,
  },
});

export default Header;
