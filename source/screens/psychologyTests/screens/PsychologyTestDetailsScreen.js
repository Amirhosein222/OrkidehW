/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  ActivityIndicator,
  FlatList,
  Image,
  View,
  StyleSheet,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import {
  Button,
  ScreenHeader,
  Snackbar,
  BackgroundView,
} from '../../../components/common';
import { TestResultModal } from '../components/modals';
import PsychologyTestDetail from '../components/psTestDetails';

import { getTestDetailsApi, submitAnswersApi } from '../apis';
import { COLORS, ICON_SIZE, rh, rw } from '../../../configs';
import { useIsPeriodDay, useApi } from '../../../libs/hooks';

import EnabledCheck from '../../../assets/icons/btns/enabled-check.svg';

const PsychologyTestDetailsScreen = ({ navigation, route }) => {
  const isPeriodDay = useIsPeriodDay();
  const isFocused = useIsFocused();
  const params = route.params;
  const [resetState, setResetState] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const selectedChoices = useRef({
    gender: 'woman',
    test_id: params.testId,
    option_id: [],
  });

  const [details, setDetails] = useApi(() => getTestDetailsApi(params.testId));
  const [submitAnswers, setSubmitAnswers] = useApi(() =>
    submitAnswersApi(selectedChoices.current),
  );

  const handleTestAnswers = function (answers) {
    const selecteds = [];
    for (let value of answers.values()) {
      selecteds.push(value.oId);
    }
    selectedChoices.current.option_id = selecteds;
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const sendTestAnswers = async function () {
    console.log('selectedChoices ', selectedChoices);
    if (selectedChoices.current.option_id.length < 2) {
      setSnackbar({
        msg: 'لطفا به تمام سوالات پاسخ دهید.',
        visible: true,
      });
      return;
    } else {
      setSubmitAnswers();
    }
  };

  const renderAnswers = function ({ item }) {
    return (
      <PsychologyTestDetail
        testDetails={item}
        handleTestAnswers={handleTestAnswers}
        resetState={resetState}
      />
    );
  };

  useEffect(() => {
    setDetails();
  }, [params.testId]);

  useEffect(() => {
    details.data &&
      !details.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [details]);

  useEffect(() => {
    if (submitAnswers.data && submitAnswers.data.is_successful) {
      selectedChoices.current = {
        gender: 'woman',
        test_id: params.testId,
        option_id: [],
      };
      setShowResultModal(true);
    }

    if (submitAnswers.data && !submitAnswers.data.is_successful) {
      selectedChoices.current = {
        gender: 'woman',
        test_id: params.testId,
        option_id: [],
      };
      params.showAlert(submitAnswers.data.message);
      navigation.navigate('PsychologyTests');
    }
  }, [submitAnswers]);

  useEffect(() => {
    setResetState(!resetState);
  }, [isFocused]);

  if (details.isFetching) {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
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

        <ScreenHeader
          title="تست های روانشناسی"
          disableBack={submitAnswers.isFetching}
        />

        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/icons8-heart-100.png')}
            style={styles.image}
          />
        </View>

        {details.data && (
          <FlatList
            data={[details.data.data]}
            renderItem={renderAnswers}
            style={{ width: '100%' }}
          />
        )}

        <Button
          title="مشاهده نتیجه"
          Icon={() => <EnabledCheck style={ICON_SIZE} />}
          color={COLORS.primary}
          onPress={() => sendTestAnswers()}
          loading={submitAnswers.isFetching}
          disabled={submitAnswers.isFetching}
          style={{ marginTop: 'auto', marginBottom: rh(4), width: rw(80) }}
        />

        {showResultModal && (
          <TestResultModal
            visible={showResultModal}
            closeModal={() => setShowResultModal(false)}
            tid={params.testId}
          />
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

const styles = StyleSheet.create({
  btn: {
    height: 39,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 20,
    margin: 10,
    width: '50%',
    alignSelf: 'center',
  },
  imageContainer: {
    width: rw(90),
    height: rh(10),
    alignItems: 'center',
    marginVertical: rh(3),
    borderRightWidth: 4,
    borderRightColor: COLORS.icon,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default PsychologyTestDetailsScreen;
