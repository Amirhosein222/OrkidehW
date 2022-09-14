/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StatusBar, FlatList, ActivityIndicator } from 'react-native';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  Snackbar,
  Text,
  ScreenHeader,
  BackgroundView,
} from '../../components/common';
import { PsychologyTestCard } from '../../components/PsychologyTests';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../configs';
import { showSnackbar } from '../../libs/helpers';

const PsychologyTestsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [testsList, setTestsList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getTests = async function () {
    const loginClient = await getLoginClient();
    loginClient.get('test/list/index?gender=woman').then((response) => {
      if (response.data.is_successful) {
        setIsFetching(false);
        setTestsList(response.data.data);
      } else {
        setIsFetching(false);
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      }
    });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const showAlert = (msg) => {
    showSnackbar(msg);
  };

  const RenderTests = function ({ item }) {
    return (
      <PsychologyTestCard
        testTitle={item.title}
        description={item.description}
        testId={item.id}
        navigation={navigation}
        showAlert={showAlert}
      />
    );
  };

  useEffect(() => {
    getTests();
  }, []);

  if (isFetching === true) {
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
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
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
        {testsList.length ? (
          <FlatList
            data={testsList}
            keyExtractor={(item) => item.id}
            renderItem={RenderTests}
            style={{ marginTop: 20 }}
            contentContainerStyle={{
              marginBottom: rh(2),
              width: rw(100),
            }}
          />
        ) : (
          <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <Text large color={COLORS.blue}>
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
