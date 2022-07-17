/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { Text } from '../../components/common';

import { COLORS, rh } from '../../configs';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

const NoRelation = ({ navigation }) => {
  const { isPeriodDay } = useContext(WomanInfoContext);

  return (
    <View style={styles.noRel}>
      <Text color={COLORS.rossoCorsa}>
        شما تاکنون هیچ رابطه ای ثبت نکرده اید
      </Text>
      <Button
        onPress={() => navigation.navigate('ContactSpouse')}
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
        mode="contained"
        style={styles.btn}>
        <Text color="white">ثبت رابطه</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '70%',
    height: 40,
    marginTop: 10,
    alignSelf: 'center',
  },
  noRel: {
    width: '100%',
    marginTop: rh(2),
  },
});

export default NoRelation;
