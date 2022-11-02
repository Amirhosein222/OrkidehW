/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-paper';

import { Text } from '../../../../../components/common';
import { COLORS, rh, rw } from '../../../../../configs';

const Reminder = ({ title, type, disable, onSwitch, handleDefaultValue }) => {
  const [status, setStatus] = useState();

  const onToggleSwitch = stat => {
    setStatus(stat);
    onSwitch({ type, status: stat });
  };

  useEffect(() => {
    const defaultValue = handleDefaultValue(type);
    setStatus(defaultValue);

    return () => setStatus();
  }, []);

  return (
    console.log('status ', status),
    (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            width: rw(82),
            justifyContent: 'space-between',
          }}>
          <Switch
            disabled={disable}
            value={status}
            onValueChange={val => onToggleSwitch(val)}
            color={COLORS.borderLinkBtn}
          />
          <Text color={COLORS.textDark}>{title} :</Text>
        </View>
      </View>
    )
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

export default Reminder;
