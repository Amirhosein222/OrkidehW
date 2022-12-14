/* eslint-disable react-native/no-inline-styles */
import { useEffect } from 'react';
import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { COLORS, rh, rw } from '../../../configs';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { Text, Picker } from '../../../components/common';

const MaritalStatus = ({ setMarital, selectedValue }) => {
  const { allSettings } = useContext(WomanInfoContext);
  const [resetPicker, setResetPicker] = useState(false);
  const [maritalStatOptions, setMaritalStatOptions] = useState([]);
  const selectedOption = useRef(null);

  const onSelectOption = m => {
    if (typeof m === 'object') {
      return;
    }
    selectedOption.current = m;
    setMarital(m);
  };

  useEffect(() => {
    const result = [];
    allSettings &&
      allSettings.forEach((s, index) => {
        if (s.key === 'app_marital_status[]') {
          result.push({ label: s.value, value: s.value });
        }
      });
    setMaritalStatOptions(result);
  }, []);

  return (
    <View
      style={{
        width: rw(100),
        alignItems: 'center',
        marginBottom: rh(2),
        justifyContent: 'space-around',
        height: selectedValue ? rh(9) : rh(11),
      }}>
      <View style={styles.container}>
        {maritalStatOptions.length ? (
          <Picker
            data={maritalStatOptions}
            onItemSelect={onSelectOption}
            reset={resetPicker}
            placeholder={selectedValue ? selectedValue : 'انتخاب وضعیت تاهل'}
            listMode="SCROLLVIEW"
            containerStyle={{ width: rw(55) }}
          />
        ) : null}

        <View style={{ width: rw(26.3) }}>
          <Text size={11} color={COLORS.textLight} alignSelf="flex-end">
            وضعیت تاهل :
          </Text>
        </View>
      </View>
      {!selectedValue ? (
        <View
          style={{
            width: rw(50),
            alignSelf: 'center',
            // marginTop: 'auto',
            marginLeft: rw(9),
          }}>
          <Text color={COLORS.error} size={8} bold alignSelf="flex-start">
            وارد کردن وضعیت تاهل الزامی است
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default MaritalStatus;

const styles = StyleSheet.create({
  container: {
    width: rw(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
