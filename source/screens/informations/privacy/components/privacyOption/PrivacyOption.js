/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-paper';

import { Text } from '../../../../../components/common';
import { COLORS, rh, rw } from '../../../../../configs';

const PrivacyOption = ({
  title,
  handleModal,
  type,
  modalType,
  switchStatus,
  setSwichStatus,
}) => {
  const onToggleSwitch = async () => {
    modalType(type);
    setSwichStatus(!switchStatus);
    !switchStatus && handleModal();
    switchStatus &&
      (await AsyncStorage.removeItem(
        type === 'finger' ? 'isFingerActive' : 'isPassActive',
      ));
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          width: rw(82),
          justifyContent: 'space-between',
        }}>
        <Switch
          value={switchStatus}
          onValueChange={onToggleSwitch}
          color={COLORS.borderLinkBtn}
        />
        <Text color={COLORS.textDark}>{title} :</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: rw(82),
    marginTop: rh(3),
    marginVertical: rh(0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrivacyOption;
