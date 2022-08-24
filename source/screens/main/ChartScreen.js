/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  FlatList,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import getWomanClient from '../../libs/api/womanApi';

import { PMSInfoScreen } from '../index';
import {
  BackgroundView,
  ScreenHeader,
  Text,
  Snackbar,
  Divider,
} from '../../components/common';
import {
  ChartTwo,
  ChartThree,
  ChartFour,
  VerticalBars,
  ChartCard,
} from '../../components/charts';

import { COLORS, rh, rw, SCROLL_VIEW_CONTAINER } from '../../configs';
import { useIsPeriodDay, useFullInfo } from '../../libs/hooks';

const ChartScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const fullInfo = useFullInfo();
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [circleChart, setCircleChart] = useState(null);
  const [chartTwo, setChartTwo] = useState(null);

  const handleChartTwoData = function (datas) {
    let modifiedData = [];
    datas.data.map((i, index) => {
      datas.labels.some((l, indexL) => {
        if (index === indexL) {
          modifiedData.push({ data: i, label: l });
          return true;
        }
      });
    });
    setChartTwo(modifiedData);
  };

  const getReports = async function () {
    const womanClient = await getWomanClient();
    setIsLoading(true);
    womanClient.get('report').then((response) => {
      setIsLoading(false);
      if (response.data.data) {
        setCircleChart(response.data.data.chart1);
        setReports(response.data.data);
        handleChartTwoData(response.data.data.chart2);
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

  const RenderCircleCharts = function ({ item }) {
    return (
      <ChartCard title="نمودار روزها در شش دوره اخیر شما">
        <View style={styles.pieContainer}>
          <CountdownCircleTimer
            isPlaying={false}
            size={120}
            duration={50}
            initialRemainingTime={item}
            colors={[
              ['#004777', 0.4],
              ['#F7B801', 0.4],
              ['#A30000', 0.2],
            ]}>
            {({ remainingTime, animatedColor }) => (
              <Animated.Text style={{ color: animatedColor }}>
                {item.total}
              </Animated.Text>
            )}
          </CountdownCircleTimer>
          <Text color={COLORS.textLight}>{item.type}</Text>
        </View>
      </ChartCard>
    );
  };

  useEffect(() => {
    getReports();
  }, []);

  if (isLoading) {
    return (
      <BackgroundView bgColor={COLORS.white} justifyContent="flex-start">
        <StatusBar translucent backgroundColor="transparent" />
        <ScreenHeader title="نمودار وضعیت من" />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      </BackgroundView>
    );
  } else {
    return (
      <BackgroundView>
        <StatusBar translucent backgroundColor="white" />
        <ScreenHeader title="نمودار وضعیت من" />
        <ScrollView
          contentContainerStyle={SCROLL_VIEW_CONTAINER}
          style={{ width: '100%', margin: 10 }}>
          {reports ? (
            <View style={{ width: '100%', flex: 1 }}>
              {/* {fullInfo.accountType !== 'golden' ? (
                <FlatList
                  data={circleChart}
                  renderItem={RenderCircleCharts}
                  numColumns={2}
                  contentContainerStyle={{
                    width: rw(100),
                    alignSelf: 'center',
                    paddingVertical: rh(2),
                    alignItems: 'center',
                  }}
                />
              ) : ( */}
              <>
                <ChartCard title="نمودار روزها در شش دوره اخیر شما">
                  <ChartThree />
                </ChartCard>

                <FlatList
                  data={circleChart}
                  renderItem={RenderCircleCharts}
                  numColumns={2}
                  contentContainerStyle={{
                    width: rw(100),
                    alignSelf: 'center',
                    paddingVertical: rh(2),
                    alignItems: 'center',
                  }}
                />

                {/* <ChartTwo chartData={chartTwo} /> */}

                {/* <ChartFour
                  chartData={{
                    data: [
                      { value: 30, label: 'روز 1' },
                      { value: 40, label: 'روز 2' },
                      { value: 25, label: 'روز 3' },
                      { value: 30, label: 'روز 4' },
                      { value: 18, label: 'روز 5' },
                    ],
                  }}
                /> */}
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <Text color={COLORS.dark} bold>
                    همسالان شما
                  </Text>
                  <Text
                    color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
                    bold>
                    شما
                  </Text>
                </View> */}
                <Divider
                  color={isPeriodDay ? COLORS.rossoCorsa : COLORS.textDark}
                  width={rw(82)}
                  style={{
                    marginTop: 5,
                    alignSelf: 'center',
                    borderBottomWidth: 0.7,
                  }}
                />
                <PMSInfoScreen />
              </>
              {/* )} */}
            </View>
          ) : null}
          {/* <VerticalBars /> */}
        </ScrollView>
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
  pieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default ChartScreen;
