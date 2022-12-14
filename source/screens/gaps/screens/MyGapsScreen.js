/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { Pressable, StatusBar, StyleSheet, FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  Snackbar,
  DeleteModal,
  BackgroundView,
} from '../../../components/common';
import GapCard from '../components/gapCard';
import { AddMemoryModal } from '../components/modals';

import { getMyGapsApi } from '../apis/apis';
import { COLORS, rh, rw } from '../../../configs';
import { useApi, useIsPeriodDay } from '../../../libs/hooks';

const MyGapsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [showModal, setShowModal] = useState(false);
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    id: null,
  });
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [gaps, setGaps] = useState([]);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [edit, setEdit] = useState({ isEdit: false, memory: null });
  const [myGaps, setMyGaps] = useApi(() => getMyGapsApi());

  const handleNewMemory = function () {
    setShouldUpdate(!shouldUpdate);
  };

  const handleDeleteCm = id => {
    setShowDeleteModal({ show: true, id: id });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const handleModal = function () {
    setShowModal(!showModal);
  };

  const onEdit = m => {
    setEdit({ isEdit: true, memory: m });
    setShowAddMemoryModal(true);
  };

  const onAdd = m => {
    setEdit({ isEdit: false, memory: null });
    setShowAddMemoryModal(true);
  };

  const RenderMemory = function ({ item }) {
    return (
      <GapCard
        memory={item}
        handleCommentModal={handleModal}
        myMemory={true}
        navigation={navigation}
        handleNewMemory={handleNewMemory}
        handleEdit={onEdit}
        handleDelete={handleDeleteCm}
        updateGaps={setMyGaps}
      />
    );
  };

  useEffect(() => {
    setMyGaps();
  }, [shouldUpdate]);

  useEffect(() => {
    if (myGaps.data && myGaps.data.is_successful) {
      setGaps(myGaps.data.data.reverse());
    }
    myGaps.data &&
      !myGaps.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [myGaps]);

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {gaps.length ? (
        <FlatList
          data={gaps}
          keyExtractor={item => String(item.id)}
          renderItem={RenderMemory}
          contentContainerStyle={{
            paddingBottom: rh(1.5),
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : null}

      <Pressable
        onPress={onAdd}
        style={{
          ...styles.plusIconContainer,
          backgroundColor: isPeriodDay ? COLORS.periodDay : COLORS.primary,
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
          setSnackbar={setSnackbar}
        />
      )}
      {showDeleteModal.show && (
        <DeleteModal
          type="mem"
          title="خاطره"
          visible={showDeleteModal.show}
          closeModal={() => setShowDeleteModal({ show: false, id: null })}
          id={showDeleteModal.id}
          updateData={setMyGaps}
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
    top: rh(60),
    left: rw(44),
    zIndex: 1,
  },
});

export default MyGapsScreen;
