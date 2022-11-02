/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import Picker from '@gregfrench/react-native-wheel-picker';

import { Text, Button } from '../../../../../components/common';
import { rw, rh, COLORS, ICON_SIZE } from '../../../../../configs';

import { editPeriodInfoApi } from '../../apis';
import { useApi } from '../../../../../libs/hooks';

import EnableCheck from '../../../../../assets/icons/btns/enabled-check.svg';
import Close from '../../../../../assets/icons/btns/close.svg';
import { WomanInfoContext } from '../../../../../libs/context/womanInfoContext';

let PickerItem = Picker.Item;

const PeriodInfoEditModal = ({
  cycle,
  visible,
  closeModal,
  updateCycles,
  setSnackbar,
}) => {
  const { periodInfo } = useContext(WomanInfoContext);
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(null);
  const [editInfo, setEditInfo] = useApi(() =>
    editPeriodInfoApi(
      periodInfo.j_start_date.split('-').join('/'),
      cycle.id === 1 ? selectedRef.current : periodInfo.cycle_length,
      cycle.id === 2 ? selectedRef.current : periodInfo.period_length,
    ),
  );

  const handleSelectedValue = (i) => {
    setSelected(i);
    selectedRef.current =
      cycle.id === 1
        ? i + 21
        : cycle.id === 2
        ? i + 3
        : cycle.id === 3
        ? i + 1
        : i + 5;
  };

  const onSubmit = () => {
    setEditInfo();
  };

  useEffect(() => {
    if (editInfo.data && editInfo.data.is_successful) {
      updateCycles();
      closeModal();
    }
    if (editInfo.data && !editInfo.data.is_successful) {
      closeModal();
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
    }
  }, [editInfo]);

  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      coverScreen={true}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={0}
      animationOutTiming={0}
      animationInTiming={0}
      animationIn="slideInUp"
      onBackdropPress={editInfo.isFetching ? () => {} : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ marginLeft: 'auto' }} />
          <Text medium style={{ marginLeft: 'auto', marginRight: rw(5) }}>
            {cycle.title} خود را وارد کنید
          </Text>
          <Pressable
            onPress={editInfo.isFetching ? () => {} : closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Close style={{ ...ICON_SIZE, marginRight: rw(5) }} />
          </Pressable>
        </View>
        <Picker
          style={{ width: rw(70), height: 180, marginTop: rh(3) }}
          lineColor="black"
          lineGradientColorFrom="#687777"
          lineGradientColorTo="#687777"
          selectedValue={selected}
          selectedIndex={selected}
          itemStyle={{
            color: COLORS.textDark,
            fontSize: 24,
            fontFamily: 'IRANYekanMobileBold',
          }}
          onValueChange={(index) => handleSelectedValue(index)}>
          {cycle.data.map((value, i) => (
            <PickerItem label={value} value={i} key={i} />
          ))}
        </Picker>

        <Button
          title="تایید اطلاعات"
          Icon={() => <EnableCheck style={ICON_SIZE} />}
          color={COLORS.primary}
          onPress={onSubmit}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
          loading={editInfo.isFetching}
          disabled={editInfo.isFetching}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginBottom: 'auto',
  },
  content: {
    width: rw(100),
    height: rh(45),
    marginTop: 'auto',
    elevation: 5,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: COLORS.mainBg,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(2),
  },
});
export default PeriodInfoEditModal;
