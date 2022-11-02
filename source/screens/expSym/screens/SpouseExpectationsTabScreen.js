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

import {
  getExpectationsFromSpouseApi,
  getMyExpectationsFromSpouseApi,
} from '../apis';
import { COLORS, rh } from '../../../configs';
import { useApi } from '../../../libs/hooks';

const SpouseExpectationsTabScreen = ({ navigation }) => {
  const womanInfo = useContext(WomanInfoContext);
  const selectedExp = useRef(null);

  const [expectations, setExpectations] = useState([]);
  const [myExps, setMyExps] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [resetPicker, setResetPicker] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const [getExpectationsFromSpouse, setGetExpectationsFromSpouse] = useApi(() =>
    getExpectationsFromSpouseApi(womanInfo.activeRel.relId),
  );
  const [myExpsFromSpouce, setMyExpsFromSpouse] = useApi(() =>
    getMyExpectationsFromSpouseApi(womanInfo.activeRel.relId),
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

  const openInfoModal = (exp) => {
    selectedExp.current = exp;
    setShowInfoModal(true);
  };

  const onSelectSpouse = (spouse) => {
    setActiveSpouse(spouse);
  };

  const RenderExpectations = ({ item }) => {
    const alreadySelected =
      (myExps.length &&
        myExps.some((exp) => exp.expectation_id === item.id && true)) ||
      false;
    return (
      <ExpSympCard
        item={item}
        onReadMore={openInfoModal}
        onPress={openInfoModal}
        isExp={true}
        alreadySelected={alreadySelected}
      />
    );
  };

  useEffect(() => {
    womanInfo.activeRel && setMyExpsFromSpouse();
  }, [womanInfo.activeRel]);

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
    if (myExpsFromSpouce.data && myExpsFromSpouce.data.is_successful) {
      setMyExps(myExpsFromSpouce.data.data);
    }
    myExpsFromSpouce.data &&
      !myExpsFromSpouce.data.is_successful &&
      setSnackbar({
        msg: myExpsFromSpouce.data.message,
        visible: true,
      });
  }, [myExpsFromSpouce]);

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
          setSnackbar={setSnackbar}
          updateMyExps={setMyExpsFromSpouse}
          isExp={true}
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
