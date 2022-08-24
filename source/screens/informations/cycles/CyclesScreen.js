/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { CyclesOption } from './components';
import {
  ScreenHeader,
  Divider,
  Text,
  BackgroundView,
} from '../../../components/common';

import { bleedingText, ovalText, pmsText } from './configs';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';
import { baseUrl, COLORS, rh, rw } from '../../../configs';
import { numberConverter } from '../../../libs/helpers';
import { getCycles } from '../../../libs/apiCalls';
import { useApi } from '../../../libs/hooks';

const CyclesScreen = ({ navigation }) => {
  const { periodInfo, savePeriodInfo } = useContext(WomanInfoContext);
  const [cycles, setCycles] = useApi(() => getCycles());

  useEffect(() => {
    if (!periodInfo) {
      setCycles();
    }
  }, []);

  useEffect(() => {
    if (cycles.data && cycles.data.is_successful) {
      savePeriodInfo(cycles.data.data[0]);
    }
  }, [cycles]);

  return (
    // console.log('periodInfo ', periodInfo.newCycle.cycle_length),
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
            title="طول سیکل قاعدگی شما "
            data={`${periodInfo.cycle_length} روز `}
          />
          <CyclesOption
            icon="calendar-day"
            title="روز های خونریزی شما"
            data={`${periodInfo.period_length} روز `}
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
            title="شروع تخمک گذاری شما"
            data="روز 12 دوره"
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
            title="شروع PMS شما "
            data="روز 16 دوره"
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
          color={COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      )}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
    alignItems: 'center',
    width: rw(100),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    marginTop: rh(2),
    paddingBottom: rh(4),
  },
  image: {
    width: 100,
    height: 100,
    marginTop: rh(2),
  },
});

export default CyclesScreen;
