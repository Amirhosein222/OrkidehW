/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Button } from 'react-native-paper';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  Text,
  TabBar,
  Header,
  Snackbar,
} from '../../components/common';
import { PsychologyTestDetail } from '../../components/PsychologyTests';
import { COLORS, rh, STATUS_BAR_HEIGHT } from '../../configs';
import { showSnackbar } from '../../libs/helpers';
import { useIsPeriodDay } from '../../libs/hooks';

const PsychologyTestDetailsScreen = ({ navigation, route }) => {
  const isPeriodDay = useIsPeriodDay();
  const params = route.params;
  const [testDetails, setTestDetails] = useState([]);
  const [resetState, setResetState] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSending, setIsSending] = useState(false);
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
            navigation.navigate('TestResult', { testId: params.testId });
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
      <Container justifyContent="center">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
        />
      </Container>
    );
  } else {
    return (
      <Container justifyContent="flex-start">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header
          navigation={navigation}
          style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
        />
        <FlatList
          data={testDetails}
          renderItem={renderAnswers}
          style={{ width: '100%' }}
        />

        <Button
          mode="contained"
          color={COLORS.grey}
          style={styles.btn}
          loading={isSending ? true : false}
          disabled={isSending ? true : false}
          onPress={() => sendTestAnswers()}>
          <Text bold color={COLORS.white}>
            مشاهده نتیجه تست
          </Text>
        </Button>

        <TabBar seperate={true} navigation={navigation} />
        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </Container>
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
});

export default PsychologyTestDetailsScreen;
