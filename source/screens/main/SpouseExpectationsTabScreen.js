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
} from '../../components/common';
import {
  ExpSympInfoModal,
  ExpSympCard,
} from '../../components/expectationsAndSymptoms';

import getLoginClient from '../../libs/api/loginClientApi';
import {
  saveActiveRel,
  WomanInfoContext,
} from '../../libs/context/womanInfoContext';

import { COLORS, HEIGHT, rh, rw } from '../../configs';

const HusbandExpectationsScreen = ({ navigation }) => {
  const womanInfo = useContext(WomanInfoContext);
  const [expectations, setExpectations] = useState({});
  const [isStoring, setIsStoring] = useState({ storing: false, exId: null });
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [resetPicker, setResetPicker] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const selectedExp = useRef(null);

  const getExpectationsFromSpouse = async function () {
    if (!womanInfo.activeRel) {
      return;
    }
    const loginClient = await getLoginClient();
    loginClient
      .get(
        `index/expectation?relation_id=${womanInfo.activeRel.relId}&gender=woman`,
      )
      .then((response) => {
        if (response.data.is_successful) {
          setExpectations(response.data.data);
        } else {
          setSnackbar({
            msg: response.data.message,
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

  const storeExpectation = async function (exp) {
    const loginClient = await getLoginClient();
    setIsStoring({ storing: true, exId: exp.id });
    const formData = new FormData();
    formData.append('expectation_id', exp.id);
    formData.append('relation_id', womanInfo.activeRel.relId);
    formData.append('gender', 'woman');
    loginClient.post('store/expectation', formData).then((response) => {
      setIsStoring({ storing: false, exId: null });
      if (response.data.is_successful) {
        setSnackbar({
          msg: 'با موفقیت ثبت شد.',
          visible: true,
          type: 'success',
        });
        handleModal();
      } else {
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
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
        onPress={storeExpectation}
        onReadMore={openInfoModal}
        isExp={isStoring}
      />
    );
  };

  useEffect(() => {
    getExpectationsFromSpouse();
  }, [womanInfo.activeRel]);

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
  btn: {
    width: '45%',
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  noRel: {
    width: '100%',
    marginTop: rh(30),
  },
  expTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexShrink: 1,
    width: '100%',
    marginTop: rh(1),
  },
  expItem: {
    marginHorizontal: rw(2),
    width: rw(50),
    marginVertical: rh(1),
    flexShrink: 1,
    padding: 10,
  },
  expIcon: {
    marginLeft: rw(1),
    alignSelf: 'flex-start',
  },
  expImage: {
    width: 50,
    height: 50,
  },
  expImageContainer: {
    width: 89,
    height: 89,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45,
    borderColor: 'red',
    borderWidth: 2,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});

export default HusbandExpectationsScreen;
