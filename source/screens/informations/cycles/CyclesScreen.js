/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';

import { CyclesOption, PeriodInfoEditModal } from './components';
import {
  ScreenHeader,
  Divider,
  Text,
  BackgroundView,
  Snackbar,
} from '../../../components/common';

import { bleedingText, ovalText, pmsText, cycles } from './constants';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { COLORS, rh, rw } from '../../../configs';
import { numberConverter } from '../../../libs/helpers';
import { getCycles } from '../../../libs/apiCalls';
import { useApi, useIsPeriodDay } from '../../../libs/hooks';

const CyclesScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const { periodInfo, savePeriodInfo } = useContext(WomanInfoContext);

  const [showEditModal, setShowEditModal] = useState({
    show: false,
    title: '',
  });
  const [snackbar, setSnackbar] = useState(false);

  const [userCycles, setUserCycles] = useApi(() => getCycles());

  const handleEditModalType = (cyc) => {
    setShowEditModal({ show: true, selected: cyc });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  useEffect(() => {
    if (!periodInfo) {
      setUserCycles();
    }
  }, []);

  useEffect(() => {
    if (userCycles.data && userCycles.data.is_successful) {
      savePeriodInfo(userCycles.data.data[0]);
    }
  }, [userCycles]);

  return (
    <BackgroundView>
      <ScreenHeader title="سیکل قاعدگی" />
      {periodInfo ? (
        <ScrollView
          style={{ width: rw(100) }}
          contentContainerStyle={{
            width: rw(100),
            alignItems: 'center',
            paddingVertical: rh(2),
          }}>
          <CyclesOption
            icon="undo-alt"
            cycle={cycles[0]}
            data={`${periodInfo.cycle_length} روز `}
            onPress={handleEditModalType}
          />
          <CyclesOption
            icon="calendar-day"
            cycle={cycles[1]}
            data={`${periodInfo.period_length} روز `}
            onPress={handleEditModalType}
          />
          <View style={{ width: rw(84), marginTop: rh(2) }}>
            <Text color={COLORS.textLight} textAlign="right" small>
              {numberConverter(bleedingText)}
            </Text>
          </View>

          <Divider
            color={COLORS.textDark}
            width="82%"
            style={{ marginTop: rh(2) }}
            borderWidth={0.6}
          />
          <CyclesOption
            icon="calendar-check"
            cycle={cycles[2]}
            data={`${periodInfo.ovulation_length || '_'} روز `}
            onPress={handleEditModalType}
          />
          <View style={{ width: rw(84), marginTop: rh(2) }}>
            <Text color={COLORS.textLight} textAlign="right" small>
              {numberConverter(ovalText)}
            </Text>
          </View>

          <Divider
            color={COLORS.textDark}
            width="82%"
            style={{ marginTop: rh(4) }}
            borderWidth={0.6}
          />
          <CyclesOption
            icon="calendar-minus"
            cycle={cycles[3]}
            data="روز 16 دوره"
            onPress={handleEditModalType}
          />
          <View style={{ width: rw(84), marginTop: rh(2) }}>
            <Text color={COLORS.textLight} textAlign="right" small>
              {numberConverter(pmsText)}
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      )}
      {showEditModal.show ? (
        <PeriodInfoEditModal
          visible={showEditModal.show}
          cycle={showEditModal.selected}
          closeModal={() => setShowEditModal(false)}
          setSnackbar={setSnackbar}
          updateCycles={setUserCycles}
        />
      ) : null}
      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </BackgroundView>
  );
};

export default CyclesScreen;
