/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { StatusBar, ActivityIndicator, FlatList } from 'react-native';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  BackgroundView,
  Container,
  ReportModal,
  Snackbar,
} from '../../components/common';
import { MemoriesCard } from '../../components/memories';
import { COLORS, rh, rw } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const AllGapsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [allMemories, setAllMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState();
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getAllMemories = async function () {
    setIsLoading(true);
    const loginClient = await getLoginClient();
    loginClient
      .get('index/accepted-memory?filter_user=1&gender=woman')
      .then((response) => {
        setIsLoading(false);
        if (response.data.is_successful) {
          setAllMemories(response.data.data);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      });
  };

  const handleModal = function (memory) {
    setSelectedMemory(memory);
    setShowModal(!showModal);
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const RenderMemory = function ({ item }) {
    return (
      <MemoriesCard
        memory={item}
        handleCommentModal={handleModal}
        myMemory={false}
        handleReportModal={() => setShowReportModal(true)}
      />
    );
  };

  useEffect(() => {
    getAllMemories();
  }, []);

  if (isLoading) {
    return (
      <BackgroundView style={{ width: rw(100), height: rh(100) }}>
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          style={{ marginTop: rh(3) }}
        />
      </BackgroundView>
    );
  } else {
    return (
      <BackgroundView style={{ width: rw(100), height: rh(100) }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {allMemories.length ? (
          <FlatList
            data={allMemories}
            keyExtractor={(item) => String(item.id)}
            renderItem={RenderMemory}
          />
        ) : null}
        {showReportModal && (
          <ReportModal
            type="memory"
            title="خاطره"
            visible={showReportModal}
            closeModal={() => setShowReportModal(false)}
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
