/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import getLoginClient from '../../../libs/api/loginClientApi';

import { PMSInfoScreen } from '../../index';
import {
  BackgroundView,
  ScreenHeader,
  Snackbar,
  Divider,
} from '../../../components/common';
import {
  DaysPieChart,
  ChartCard,
  PeriodLengthChart,
  PeriodDaysChart,
} from '../../../components/charts';

import { COLORS, rw, SCROLL_VIEW_CONTAINER } from '../../../configs';
import { useIsPeriodDay } from '../../../libs/hooks';

const ChartScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pieChartData, setPieChartData] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getReports = async function () {
    const loginClient = await getLoginClient();
    setIsLoading(true);
    loginClient.get('stats?gender=woman').then(response => {
      setIsLoading(false);
      if (response.data.data) {
        const pieChart = response.data.data.circle.map(rec => {
          return {
            name: rec.name,
            population: rec.data,
            color: rec.color,
          };
        });
        setPieChartData(pieChart);
        setReports(response.data.data);
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
    getReports();
  }, []);

  if (isLoading) {
    return (
      <BackgroundView bgColor={COLORS.white} justifyContent="flex-start">
        <StatusBar translucent backgroundColor="transparent" />
        <ScreenHeader title="نمودار وضعیت من" />
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
        <StatusBar translucent backgroundColor="white" />
        <ScreenHeader title="نمودار وضعیت من" />
        <ScrollView
          contentContainerStyle={SCROLL_VIEW_CONTAINER}
          style={{ width: '100%', margin: 10 }}>
          {reports ? (
            <View style={{ width: '100%', flex: 1 }}>
              <>
                <ChartCard title="نمودار روزها در شش دوره اخیر شما">
                  <DaysPieChart chartData={pieChartData} />
                </ChartCard>
                <ChartCard title="نمودار پراکندگی طول دوره قاعدگی در همسالان شما">
                  <PeriodLengthChart chartData={reports.line} />
                </ChartCard>
                <ChartCard title="نمودار مقایسه خونریزی دوران قاعدگی شما با همسالان">
                  <PeriodDaysChart chartData={reports.column} />
                </ChartCard>

                <Divider
                  color={isPeriodDay ? COLORS.periodDay : COLORS.textDark}
                  width={rw(82)}
                  style={{
                    marginTop: 5,
                    alignSelf: 'center',
                    borderBottomWidth: 0.7,
                  }}
                />
                <PMSInfoScreen
                  data={{ pms: reports.signsPms, pmsDiff: reports.sings }}
                />
              </>
            </View>
          ) : null}
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
