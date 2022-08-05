/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import getLoginClient from '../../libs/api/loginClientApi';

import { Container, CommentModal, Snackbar } from '../../components/common';
import { MemoriesCard } from '../../components/memories';
import { COLORS, rh } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const AllMemoriesScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [allMemories, setAllMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState();
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
      />
    );
  };

  useEffect(() => {
    getAllMemories();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          style={{ marginTop: rh(3) }}
        />
      </Container>
    );
  } else {
    return (
      <Container justifyContent="center">
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
        <CommentModal
          visible={showModal}
          closeModal={handleModal}
          memoryDetail={selectedMemory}
        />
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

export default AllMemoriesScreen;
