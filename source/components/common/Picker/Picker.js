/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { COLORS, rh, rw } from '../../../configs';

const Picker = ({
  data,
  onItemSelect,
  placeholder,
  listMode = 'FLATLIST',
  reset = false,
  defaultValue = null,
  isMemory = false,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(data);

  useEffect(() => {
    if (reset) {
      isMemory ? setValue(null) : setValue({});
    }
  }, [reset]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  return (
    <DropDownPicker
      open={open}
      value={defaultValue ? defaultValue : value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      listMode={listMode}
      onChangeValue={(val) => {
        onItemSelect(val);
      }}
      labelStyle={styles.labelStyle}
      listItemLabelStyle={{ fontFamily: 'Qs_Iranyekan_bold', color: 'black' }}
      arrowColor={COLORS.white}
      containerStyle={styles.pickerContainer}
      style={{
        backgroundColor: COLORS.inputTabBarBg,
        borderWidth: 0,
        height: 40,
      }}
      itemStyle={{
        justifyContent: 'flex-start',
      }}
      dropDownContainerStyle={{
        borderWidth: 0,
        elevation: 3,
        backgroundColor: COLORS.mainBg,
      }}
      placeholderStyle={{
        fontFamily: 'Qs_Iranyekan_bold',
        color: COLORS.textLight,
      }}
      placeholder={placeholder}
    />
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    height: 40,
    width: rw(60),
    marginTop: rh(1),
    alignSelf: 'center',
  },
  labelStyle: {
    fontFamily: 'Qs_Iranyekan_bold',
    color: COLORS.textLight,
  },
});

export default Picker;
