/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';

import {
  Button,
  ScreenHeader,
  Snackbar,
  BackgroundView,
} from '../../../components/common';
import { TestResultModal } from '../components/modals';
import PsychologyTestDetail from '../components/psTestDetails';

import { getTestDetailsApi, submitAnswersApi } from '../apis';
import { baseUrl, COLORS, ICON_SIZE, rh, rw } from '../../../configs';
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
    if (
      selectedChoices.current.option_id.length <
      details.data.data.questions.length
    ) {
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
        isFocused={isFocused}
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
      setResetState(true);
      selectedChoices.current = {
        gender: 'woman',
        test_id: params.testId,
        option_id: [],
      };
      setShowResultModal(true);
    }

    if (submitAnswers.data && !submitAnswers.data.is_successful) {
      setResetState(true);
      selectedChoices.current = {
        gender: 'woman',
        test_id: params.testId,
        option_id: [],
      };
      params.showAlert(JSON.stringify(submitAnswers.data.message));
      navigation.goBack();
    }
  }, [submitAnswers]);

  if (details.isFetching) {
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

        <ScreenHeader
          title="تست های روانشناسی"
          disableBack={submitAnswers.isFetching}
        />

        <View style={styles.imageContainer}>
          {params.testImage ? (
            <Image
              source={{ uri: baseUrl + params.testImage }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 7,
                // marginTop: rh(2),
              }}
              resizeMode="cover"
            />
          ) : (
            <Octicons
              name="checklist"
              size={100}
              style={{ marginLeft: rh(2) }}
              color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
            />
          )}
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
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          onPress={() => sendTestAnswers()}
          loading={submitAnswers.isFetching}
          disabled={submitAnswers.isFetching}
          style={{ marginTop: 'auto', marginBottom: rh(3), width: rw(80) }}
        />

        {showResultModal && submitAnswers.data && details.data ? (
          <TestResultModal
            visible={showResultModal}
            closeModal={() => setShowResultModal(false)}
            testInfo={{
              id: params.testId,
              score: submitAnswers.data.data.score,
              total: submitAnswers.data.data.total,
              title: details.data.data.title,
              des: details.data.data.description || '',
              image: details.data.data.image,
            }}
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
  }
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '90%',
    height: rh(20),
    marginTop: rh(2),
    // backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 3.5,
    overflow: 'hidden',
    borderRightColor: COLORS.textLight,
  },
});

export default PsychologyTestDetailsScreen;
