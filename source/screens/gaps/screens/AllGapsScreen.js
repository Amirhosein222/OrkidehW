/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ActivityIndicator, FlatList } from 'react-native';

import {
  BackgroundView,
  ReportModal,
  Snackbar,
} from '../../../components/common';
import GapCard from '../components/gapCard';

import { getAllGapsApi } from '../apis/apis';
import { COLORS, rh } from '../../../configs';
import { useApi, useIsPeriodDay } from '../../../libs/hooks';

const AllGapsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [showReportModal, setShowReportModal] = useState(false);
  const [isFetchingCms, setIsFetchingCms] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [allGaps, setAllGaps] = useApi(() => getAllGapsApi());
  const selectedMemId = useRef(null);

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const fetchCms = () => {
    setIsFetchingCms(true);
    setAllGaps();
  };

  const handleReportModal = mId => {
    selectedMemId.current = mId;
    setShowReportModal(true);
  };

  const RenderMemory = function ({ item }) {
    return (
      <GapCard
        memory={item}
        myMemory={false}
        handleReportModal={handleReportModal}
        updateGaps={setAllGaps}
      />
    );
  };

  useEffect(() => {
    setAllGaps();
  }, []);

  useEffect(() => {
    allGaps.data &&
      !allGaps.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [allGaps]);

  if (allGaps.isFetching) {
    return (
      <BackgroundView>
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
        {allGaps.data && allGaps.data.data.length ? (
          <FlatList
            data={allGaps.data.data}
            keyExtractor={item => String(item.id)}
            renderItem={RenderMemory}
            contentContainerStyle={{
              paddingBottom: rh(1.5),
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : null}
        {showReportModal && (
          <ReportModal
            type="memory"
            title="خاطره"
            id={selectedMemId.current}
            visible={showReportModal}
            closeModal={() => setShowReportModal(false)}
            setSnackbar={setSnackbar}
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

export default AllGapsScreen;
