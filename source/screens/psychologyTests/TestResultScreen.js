/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  Text,
  RowContainer,
  Divider,
  Snackbar,
  Header,
} from '../../components/common';
import { COLORS, STATUS_BAR_HEIGHT } from '../../configs';

const TestResultScreen = ({ navigation, route }) => {
  const params = route.params;
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getResults = async function () {
    const loginClient = await getLoginClient();
    loginClient
      .get(`test/result?test_id=${params.testId}&gender=woman`)
      .then((response) => {
        setIsLoading(false);
        if (response.data.is_successful) {
          setResults(response.data.data);
        } else {
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

  useEffect(() => {
    getResults();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </Container>
    );
  } else {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'white',
        }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header
          navigation={navigation}
          style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
        />
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text medium bold>
            نتیجه تست شماره 1
          </Text>
          <Divider
            color={COLORS.primary}
            width="85%"
            style={{ marginTop: 20 }}
          />

          <RowContainer>
            <Text xl bold color={COLORS.primary}>
              {results.total}
            </Text>
            <Text margin="10" medium bold>
              امتیاز شما در این تست
            </Text>
          </RowContainer>

          <Divider
            color={COLORS.primary}
            width="85%"
            style={{ marginTop: 20 }}
          />

          {results.description ? (
            <View>
              <Text right medium bold margin="20">
                توضیحات تست
              </Text>

              <Text margin="20" medium>
                {results.description}
              </Text>
            </View>
          ) : null}

          {/* <Divider color={COLORS.primary} width="85%" style={{ marginTop: 20 }} /> */}
          {/* <RowContainer>
            <Text margin="10" medium>
              091233345678
            </Text>
            <Text bold medium>
              ارتباط با کارشناس
            </Text>
          </RowContainer>

          <RowContainer>
            <Text margin="10" medium>
              کارشناس مامایی
            </Text>
            <Text medium>خانوم مومنی</Text>
          </RowContainer> */}
        </View>

        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </View>
    );
  }
};

export default TestResultScreen;
