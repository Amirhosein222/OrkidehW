/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  Container,
  IconWithBg,
  Text,
  Snackbar,
  NoRelation,
  Picker,
} from '../../components/common';
import ExpectationInfoModal from '../../components/expectations';

import getLoginClient from '../../libs/api/loginClientApi';
import {
  saveActiveRel,
  WomanInfoContext,
} from '../../libs/context/womanInfoContext';

import { baseUrl, COLORS, rh, rw } from '../../configs';

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

  const storeExpectation = async function (id) {
    const loginClient = await getLoginClient();
    setIsStoring({ storing: true, exId: id });
    const formData = new FormData();
    formData.append('expectation_id', id);
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
          relId: response.data.data.man.id,
          label: response.data.data.man_name,
          image: response.data.data.man_image,
          mobile: response.data.data.man.mobile,
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
      <Pressable
        style={styles.expItem}
        disabled={isStoring.storing}
        onPress={() => storeExpectation(item.id)}>
        {isStoring.storing && isStoring.exId === item.id ? (
          <IconWithBg
            bgColor={COLORS.white}
            width="89px"
            height="89px"
            borderRadius="50px"
            borderColor="red"
            borderWidth="2px"
            loading
          />
        ) : (
          <>
            {item.image ? (
              <View style={styles.expImageContainer}>
                <Image
                  source={{ uri: baseUrl + item.image }}
                  style={styles.expImage}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <IconWithBg
                bgColor={COLORS.white}
                width="89px"
                height="89px"
                borderRadius="50px"
                icon="account-heart"
                iconColor={COLORS.red}
                iconSize={50}
                borderColor="red"
                borderWidth="2px"
              />
            )}
          </>
        )}

        <View style={styles.expTitleContainer}>
          <Text color={COLORS.red} small textAlign="right">
            {item.title}
          </Text>
          <Pressable hitSlop={7} onPress={() => openInfoModal(item)}>
            <FontAwesome5
              name="exclamation-circle"
              size={20}
              style={styles.expIcon}
            />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    getExpectationsFromSpouse();
  }, [womanInfo.activeRel]);

  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Pressable
        onPress={() => navigation.openDrawer()}
        style={{ marginRight: rh(2), alignSelf: 'flex-end', marginTop: rh(1) }}>
        <MaterialCommunityIcons name="menu" color={COLORS.grey} size={28} />
      </Pressable>
      {womanInfo.relations.length && womanInfo.activeRel ? (
        <FlatList
          data={expectations}
          keyExtractor={(item) => item.id}
          renderItem={RenderExpectations}
          numColumns={3}
          style={{ marginTop: 30, width: '100%' }}
          contentContainerStyle={{
            alignSelf: 'center',
            width: '100%',
          }}
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
      {/* <BottomHalfModal
        visible={showModal}
        closeModal={handleModal}
        text="با موفقیت ثبت شد"
      /> */}
      {selectedExp.current && (
        <ExpectationInfoModal
          visible={showInfoModal}
          closeModal={() => setShowInfoModal(false)}
          exp={selectedExp.current}
        />
      )}

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
    marginTop: 20,
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
