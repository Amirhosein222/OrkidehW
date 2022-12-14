/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '../../../../components/common';
import { COLORS, rh, rw } from '../../../../configs';

import GoToEditPage from '../../../../assets/icons/profilePrivacy/GoToEditPage.svg';
import { ICON_SIZE } from '../../../../configs/styles';

const ProfileOption = ({ name = 'default', title, Icon, onPress, data }) => {
  return (
    <Pressable onPress={() => onPress(title)} style={styles.container}>
      <View hitslop={7}>
        <GoToEditPage style={ICON_SIZE} />
      </View>

      <View style={{ flexDirection: 'row' }}>
        <Text color={COLORS.textDark} marginRight={rw(1)}>
          {data}
        </Text>
        <Text color={COLORS.textLight} marginRight={rw(4)}>
          {title} :
        </Text>

        {Icon()}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: rw(81),
    marginTop: rh(2),
    marginVertical: rh(0.5),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(1),
  },
});

export default ProfileOption;
