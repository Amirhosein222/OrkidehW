/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  View,
} from 'react-native';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  Button,
  ScreenHeader,
  Snackbar,
  BackgroundView,
} from '../../components/common';
import {
  PsychologyTestDetail,
  TestResultModal,
} from '../../components/PsychologyTests';
import { COLORS, rh, rw } from '../../configs';
import { showSnackbar } from '../../libs/helpers';
import { useIsPeriodDay } from '../../libs/hooks';

const TestDetail = [
  {
    title: 'تست روانشناسی 1',
    description: 'توضیحات تست',
    id: '1',
    questions: [
      {
        question: 'نظر شما چیست؟',
        options: [
          { title: 'سوال 1', id: 1, question_id: 1 },
          { title: 'سوال 2', id: 2, question_id: 1 },
          { title: 'سوال 3', id: 3, question_id: 1 },
        ],
      },
    ],
  },
];

const PsychologyTestDetailsScreen = ({ navigation, route }) => {
  const isPeriodDay = useIsPeriodDay();
  const params = route.params;
  const [testDetails, setTestDetails] = useState([]);
  const [resetState, setResetState] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  let selectedChoices = {
    gender: 'woman',
    test_id: params.testId,
    option_id: [],
  };

  const handleTestAnswers = function (answers) {
    const selecteds = [];
    for (let value of answers.values()) {
      selecteds.push(value.oId);
    }
    selectedChoices.option_id = selecteds;
  };

  const getDetails = async function () {
    setIsFetching(true);
    const loginClient = await getLoginClient();
    loginClient
      .get(`test/show?test_id=${params.testId}&gender=woman`)
      .then((response) => {
        if (response.data.is_successful) {
          setTestDetails([response.data.data]);
          setIsFetching(false);
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

  const sendTestAnswers = async function () {
    setShowResultModal(true);
    if (selectedChoices.option_id.length < testDetails[0].questions.length) {
      showSnackbar('لطفا به تمام سوالات پاسخ دهید.');
      return;
    } else {
      const loginClient = await getLoginClient();
      setIsSending(true);
      loginClient
        .post('test/answer', selectedChoices)
        .then((response) => {
          setIsSending(false);
          if (response.data.is_successful) {
            setShowResultModal(true);
            // navigation.navigate('TestResult', { testId: params.testId });
          } else {
            selectedChoices = {
              gender: 'woman',
              test_id: params.testId,
              option_id: [],
            };
            params.showAlert(response.data.message);
            setResetState(true);
            navigation.navigate('PsychologyTests');
          }
        })
        .catch((e) => {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        });
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
    getDetails();
  }, [params.testId]);

  if (isFetching === true) {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
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

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/icons8-heart-100.png')}
            style={styles.image}
          />
        </View>

        <FlatList
          data={testDetails}
          renderItem={renderAnswers}
          style={{ width: '100%' }}
        />

        <Button
          title="مشاهده نتیجه"
          icon="checkmark-sharp"
          color={COLORS.primary}
          onPress={() => sendTestAnswers()}
          loading={isSending ? true : false}
          disabled={isSending ? true : false}
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
