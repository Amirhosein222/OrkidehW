/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StatusBar, FlatList, ActivityIndicator } from 'react-native';

import {
  Snackbar,
  Text,
  ScreenHeader,
  BackgroundView,
} from '../../../components/common';
import PsychologyTestCard from '../components/psTestCard';

import { getTestsApi } from '../apis/apis';
import { useIsPeriodDay, useApi } from '../../../libs/hooks';
import { COLORS, rh, rw } from '../../../configs';

const PsychologyTestsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [tests, setTests] = useApi(() => getTestsApi());

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const showAlert = msg => {
    setSnackbar({
      msg: msg,
      visible: true,
    });
  };

  const RenderTests = function ({ item }) {
    return (
      <PsychologyTestCard
        testTitle={item.title}
        description={item.description}
        testImage={item.image}
        testId={item.id}
        navigation={navigation}
        showAlert={showAlert}
      />
    );
  };

  useEffect(() => {
    setTests();
  }, []);

  useEffect(() => {
    tests.data &&
      !tests.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [tests]);

  if (tests.isFetching) {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ScreenHeader title="تست های روانشناسی" />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      </BackgroundView>
    );
  } else {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ScreenHeader title="تست های روانشناسی" />
        {tests.data && tests.data.data.length ? (
          <FlatList
            data={tests.data.data}
            keyExtractor={item => item.id}
            renderItem={RenderTests}
            style={{ marginTop: 20 }}
            contentContainerStyle={{
              marginBottom: rh(2),
              width: rw(100),
            }}
          />
        ) : (
          <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <Text size={14} color={COLORS.blue}>
              در حال حاضر هیچ تستی وجود ندارد!
            </Text>
          </View>
        )}

        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </BackgroundView>
    );
  }
};

export default PsychologyTestsScreen;
