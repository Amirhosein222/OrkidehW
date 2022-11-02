import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Text } from '../../../../../components/common';
import { COLORS, rh, rw } from '../../../../../configs';
import { numberConverter } from '../../../../../libs/helpers';

const CyclesOption = ({ name = 'default', cycle, icon, onPress, data }) => {
  return (
    <View style={styles.container}>
      <Pressable hitslop={7} onPress={() => onPress(cycle)}>
        <FontAwesome5 name="pen" size={16} color={COLORS.textLight} />
      </Pressable>

      <View style={{ flexDirection: 'row' }}>
        <Text color={COLORS.textDark} marginRight={rw(4)}>
          {numberConverter(data)}
        </Text>
        <Text color={COLORS.textLight} marginRight={rw(4)}>
          شما {cycle.title} :
        </Text>

        <FontAwesome5
          name={icon}
          size={18}
          color={name === 'exit' ? COLORS.error : COLORS.textDark}
          style={{ marginTop: rh(0.5) }}
        />
      </View>
    </View>
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

export default CyclesOption;
