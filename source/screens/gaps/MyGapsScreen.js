/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { Pressable, StatusBar, StyleSheet, FlatList, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import getLoginClient from '../../libs/api/loginClientApi';

import { Snackbar, DeleteModal, BackgroundView } from '../../components/common';
import { MemoriesCard, AddMemoryModal } from '../../components/memories';

import { COLORS, rh, rw } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const MyGapsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [myMemories, setMyMemories] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    id: null,
  });

  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [edit, setEdit] = useState({ isEdit: false, memory: null });

  const handleNewMemory = function () {
    setShouldUpdate(!shouldUpdate);
  };

  const handleDeleteCm = (id) => {
    setShowDeleteModal({ show: true, id: id });
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

  const onEdit = (m) => {
    setEdit({ isEdit: true, memory: m });
    setShowAddMemoryModal(true);
  };

  const onAdd = (m) => {
    setEdit({ isEdit: false, memory: null });
    setShowAddMemoryModal(true);
  };

  const RenderMemory = function ({ item }) {
    return (
      <MemoriesCard
        memory={item}
        handleCommentModal={handleModal}
        myMemory={true}
        navigation={navigation}
        handleNewMemory={handleNewMemory}
        handleEdit={onEdit}
        handleDelete={handleDeleteCm}
      />
    );
  };

  useEffect(() => {
    getMyMemories();
  }, [shouldUpdate]);

  return (
    <BackgroundView style={{ width: rw(100), height: rh(100) }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <FlatList
        data={myMemories}
        keyExtractor={(item) => String(item.id)}
        renderItem={RenderMemory}
      />

      <Pressable
        onPress={onAdd}
        style={{
          ...styles.plusIconContainer,
          backgroundColor: isPeriodDay ? COLORS.fireEngineRed : COLORS.primary,
        }}>
        <FontAwesome5 name="plus" size={30} color={COLORS.white} />
      </Pressable>
      {showAddMemoryModal && (
        <AddMemoryModal
          visible={showAddMemoryModal}
          handleNewMemory={handleNewMemory}
          id={null}
          text={null}
          title={null}
          closeModal={() => setShowAddMemoryModal(false)}
          edit={edit}
        />
      )}
      {showDeleteModal.show && (
        <DeleteModal
          type="mem"
          title="خاطره"
          visible={showDeleteModal.show}
          closeModal={() => setShowDeleteModal({ show: false, id: null })}
          id={showDeleteModal.id}
          updateData={getMyMemories}
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
  plusIconContainer: {
    width: rw(14.3),
    height: rh(7),
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: rh(63),
    left: rw(44),
  },
});

export default MyGapsScreen;
