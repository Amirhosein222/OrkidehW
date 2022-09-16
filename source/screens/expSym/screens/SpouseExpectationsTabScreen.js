/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, StatusBar, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Text,
  Snackbar,
  NoRelation,
  Picker,
  BackgroundView,
} from '../../../components/common';
import { ExpSympInfoModal, ExpSympCard } from '../components';

import getLoginClient from '../../../libs/api/loginClientApi';
import {
  saveActiveRel,
  WomanInfoContext,
} from '../../../libs/context/womanInfoContext';

import { getExpectationsFromSpouseApi, storeExpectationApi } from '../apis';
import { COLORS, rh } from '../../../configs';
import { useApi } from '../../../libs/hooks';

const SpouseExpectationsTabScreen = ({ navigation }) => {
  const womanInfo = useContext(WomanInfoContext);
  const selectedExp = useRef(null);

  const [expectations, setExpectations] = useState({});
  const [isStoring, setIsStoring] = useState({ storing: false, exId: null });
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [resetPicker, setResetPicker] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [getExpectationsFromSpouse, setGetExpectationsFromSpouse] = useApi(() =>
    getExpectationsFromSpouseApi(womanInfo.activeRel.relId),
  );
  const [storeExpectation, setStoreExpectation] = useApi(() =>
    storeExpectationApi(selectedExp.current.id, womanInfo.activeRel.relId),
  );
  const onGetExpectationsFromSpouse = async function () {
    if (!womanInfo.activeRel) {
      return;
    }
    setGetExpectationsFromSpouse();
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const onStoreExpectation = async function (exp) {
    selectedExp.current = exp;
    setIsStoring({ storing: true, exId: exp.id });
    setStoreExpectation();
  };

  const setActiveSpouse = async function (value) {
    if (typeof value === 'object') {
      return true;
    }
    resetPicker && setResetPicker(false);
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', value);
    formData.append('gender', 'woman');
    loginClient.post('active/relation', formData).then((response) => {
      if (response.data.is_successful) {
        AsyncStorage.setItem(
          'lastActiveRelId',
          JSON.stringify(response.data.data.id),
        );
        saveActiveRel({
          relId: response.data.data.id,
          label: response.data.data.man_name,
          image: response.data.data.man_image,
          mobile: response.data.data.man.mobile,
          birthday: response.data.data.man.birth_date,
        });
        setSnackbar({
          msg: 'این رابطه به عنوان رابطه فعال شما ثبت شد.',
          visible: true,
          type: 'success',
        });
      } else {
        setResetPicker(true);
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };

  const handleModal = function () {
    setShowModal(!showModal);
  };

  const openInfoModal = (exp) => {
    selectedExp.current = exp;
    setShowInfoModal(true);
  };

  const onSelectSpouse = (spouse) => {
    setActiveSpouse(spouse);
  };

  const RenderExpectations = ({ item }) => {
    return (
      <ExpSympCard
        item={item}
        onPress={onStoreExpectation}
        onReadMore={openInfoModal}
        isExp={isStoring}
      />
    );
  };

  useEffect(() => {
    onGetExpectationsFromSpouse();
  }, [womanInfo.activeRel]);

  useEffect(() => {
    if (
      getExpectationsFromSpouse.data &&
      getExpectationsFromSpouse.data.is_successful
    ) {
      setExpectations(getExpectationsFromSpouse.data.data);
    }
    getExpectationsFromSpouse.data &&
      !getExpectationsFromSpouse.data.is_successful &&
      setSnackbar({
        msg: getExpectationsFromSpouse.data.message,
        visible: true,
      });
  }, [getExpectationsFromSpouse]);

  useEffect(() => {
    if (storeExpectation.data && storeExpectation.data.is_successful) {
      setIsStoring({ storing: false, exId: selectedExp.current.id });
      setSnackbar({
        msg: 'با موفقیت ثبت شد.',
        visible: true,
        type: 'success',
      });
      handleModal();
    }
    if (storeExpectation.data && !storeExpectation.data.is_successful) {
      setIsStoring({ storing: false, exId: selectedExp.current.id });
      setSnackbar({
        msg: storeExpectation.data.message,
        visible: true,
      });
    }
  }, [storeExpectation]);

  return (
    <BackgroundView resizeMode="cover">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {womanInfo.relations.length && womanInfo.activeRel ? (
        <FlatList
          data={expectations}
          keyExtractor={(item) => item.id}
          renderItem={RenderExpectations}
          numColumns={2}
          style={{ marginTop: rh(2) }}
          showsVerticalScrollIndicator={false}
        />
      ) : womanInfo.relations.length && !womanInfo.activeRel ? (
        <View style={styles.noRel}>
          <Text color={COLORS.red}>رابطه فعال خود را انتخاب کنید</Text>
          <Picker
            data={womanInfo.relations}
            onItemSelect={onSelectSpouse}
            reset={resetPicker}
            placeholder="انتخاب رابطه"
          />
        </View>
      ) : (
        <NoRelation navigation={navigation} />
      )}
      {selectedExp.current && (
        <ExpSympInfoModal
          visible={showInfoModal}
          closeModal={() => setShowInfoModal(false)}
          item={selectedExp.current}
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
  noRel: {
    width: '100%',
    marginTop: rh(30),
  },
});

export default SpouseExpectationsTabScreen;
