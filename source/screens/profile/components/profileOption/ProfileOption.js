import React from 'react';
import { Image, StyleSheet, View, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../../../../components/common';
import { COLORS, rh, rw } from '../../../../configs';
import { convertToFullDate, numberConverter } from '../../../../libs/helpers';

import GoToEditPage from '../../../../assets/icons/profilePrivacy/GoToEditPage.png';

const ProfileOption = ({ name = 'default', title, icon, onPress, data }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onPress(title)} hitslop={7}>
        <Image source={GoToEditPage} style={{ width: 25, height: 25 }} />
      </Pressable>

      <View style={{ flexDirection: 'row' }}>
        <Text color={COLORS.textDark} marginRight={rw(1)}>
          {numberConverter(data)}
        </Text>
        <Text color={COLORS.textLight} marginRight={rw(4)}>
          {title} :
        </Text>

        <Image source={icon} style={{ width: 25, height: 25 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: rw(81),
    marginTop: rh(3),
    marginVertical: rh(0.5),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(1),
  },
});

export default ProfileOption;
