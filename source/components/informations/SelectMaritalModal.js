/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

import { Text, Button, Picker } from '../common';
import { rw, rh, COLORS, ICON_SIZE } from '../../configs';
import { setMaritalStatusApi } from '../../libs/apiCalls';
import { useApi } from '../../libs/hooks';

import EnableCheck from '../../assets/icons/btns/enabled-check.svg';
import Close from '../../assets/icons/btns/close.svg';
import { WomanInfoContext } from '../../libs/context/womanInfoContext';

const SelectMaritalModal = ({
  defaultValue,
  visible,
  closeModal,
  setSnackbar,
}) => {
  const { saveFullInfo, fullInfo, allSettings } = useContext(WomanInfoContext);
  const [resetPicker, setResetPicker] = useState(false);
  const selectedOption = useRef(null);
  const [maritalStatOptions, setMaritalStatOptions] = useState([]);
  const [status, setStatus] = useApi(() =>
    setMaritalStatusApi(fullInfo, selectedOption.current),
  );

  const onSelectOption = m => {
    selectedOption.current = m;
  };

  const onSubmit = () => {
    setStatus();
  };

  useEffect(() => {
    const result = [];
    allSettings.forEach((s, index) => {
      if (s.key === 'app_marital_status[]') {
        result.push({ label: s.value, value: s.value });
      }
    });
    setMaritalStatOptions(result);
  }, []);

  useEffect(() => {
    if (status.data && status.data.is_successful) {
      saveFullInfo(status.data.data);
      closeModal();
      setSnackbar({
        msg: 'اطلاعات شما با موفقیت ویرایش شد',
        visible: true,
        type: 'success',
      });
    }
    if (status.data && !status.data.is_successful) {
      closeModal();

      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
    }
  }, [status]);

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
      onBackdropPress={status.isFetching ? () => {} : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ marginLeft: 'auto' }} />
          <Text
            bold
            size={13}
            color={COLORS.textCommentCal}
            style={{ marginLeft: 'auto', marginRight: rw(5) }}>
            وضعیت تاهل خود را انتخاب کنید
          </Text>
          <Pressable
            onPress={status.isFetching ? () => {} : closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Close style={{ ...ICON_SIZE, marginRight: rw(5) }} />
          </Pressable>
        </View>
        <View style={styles.pickerContainer}>
          {maritalStatOptions.length ? (
            <Picker
              data={maritalStatOptions}
              onItemSelect={onSelectOption}
              reset={resetPicker}
              placeholder={maritalStatOptions[0].label}
              listMode="SCROLLVIEW"
            />
          ) : null}

          <Text bold color={COLORS.textLight}>
            وضعیت تاهل :
          </Text>
        </View>

        <Button
          title="تایید اطلاعات"
          Icon={() => <EnableCheck style={ICON_SIZE} />}
          color={COLORS.primary}
          onPress={onSubmit}
          style={{ marginTop: 'auto', marginBottom: rh(4) }}
          loading={status.isFetching}
          disabled={status.isFetching}
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
    height: rh(47),
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: rw(85),
    alignSelf: 'center',
    marginTop: rh(4),
  },
});
export default SelectMaritalModal;
