/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, FlatList, View } from 'react-native';
import { Button } from 'react-native-paper';

import getLoginClient from '../../libs/api/loginClientApi';

import { Container, Text, Snackbar } from '../../components/common';
import { MemoriesCard } from '../../components/memories';

import { COLORS, rh } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const MyMemoriesScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [myMemories, setMyMemories] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const handleNewMemory = function () {
    setShouldUpdate(!shouldUpdate);
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const getMyMemories = async function () {
    const loginClient = await getLoginClient();
    loginClient.get('index/my-memory?gender=woman').then((response) => {
      if (response.data.is_successful) {
        setMyMemories(response.data.data);
      } else {
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      }
    });
  };

  const handleModal = function () {
    setShowModal(!showModal);
  };

  const RenderMemory = function ({ item }) {
    return (
      <MemoriesCard
        memory={item}
        handleCommentModal={handleModal}
        myMemory={true}
        navigation={navigation}
        handleNewMemory={handleNewMemory}
      />
    );
  };

  useEffect(() => {
    getMyMemories();
  }, [shouldUpdate]);

  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.content}>
        <Button
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
          mode="contained"
          style={[
            styles.btn,
            { width: '35%', height: 40, marginBottom: rh(1) },
          ]}
          onPress={() =>
            navigation.navigate('AddMemory', {
              handleNewMemory: handleNewMemory,
              edit: false,
              id: null,
              text: null,
              title: null,
            })
          }>
          <Text color="white">خاطره جدید</Text>
        </Button>
      </View>

      <FlatList
        data={myMemories}
        keyExtractor={(item) => String(item.id)}
        renderItem={RenderMemory}
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
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '45%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default MyMemoriesScreen;
