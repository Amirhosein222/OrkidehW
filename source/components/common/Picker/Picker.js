/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { COLORS, rh } from '../../../configs';

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
      listItemLabelStyle={{ fontFamily: 'Vazir', color: 'black' }}
      arrowColor={COLORS.white}
      containerStyle={styles.pickerContainer}
      style={{ backgroundColor: '#fafafa', marginTop: rh(1) }}
      itemStyle={{
        justifyContent: 'flex-start',
      }}
      dropDownStyle={{ backgroundColor: '#fafafa' }}
      placeholderStyle={{ fontFamily: 'Vazir', color: 'black' }}
      placeholder={placeholder}
    />
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    height: 40,
    width: '60%',
    marginTop: 5,
    alignSelf: 'center',
  },
  labelStyle: {
    color: 'black',
    fontFamily: 'Vazir',
    fontSize: 14,
  },
});

export default Picker;
