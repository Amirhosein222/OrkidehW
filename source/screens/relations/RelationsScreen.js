/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RelItem } from './components';
import {
  ScreenHeader,
  Divider,
  Text,
  DeleteModal,
  Snackbar,
  BackgroundView,
} from '../../components/common';

import getLoginClient from '../../libs/api/loginClientApi';
import {
  saveWomanRelations,
  saveActiveRel,
} from '../../libs/context/womanInfoContext';

import { COLORS, rh, rw } from '../../configs';
import { useApi, useIsPeriodDay } from '../../libs/hooks';
import { verifyRelation } from '../../libs/apiCalls';

const RelationsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();

  const verificationCode = useRef(null);
  const [relations, setRelations] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    id: null,
  });
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [verifyCode, setVerifyCode] = useApi(() =>
    verifyRelation(verificationCode.current),
  );

  const getRelations = async function () {
    const lastActiveRel = await AsyncStorage.getItem('lastActiveRelId');
    saveActiveRel(null);
    setLoadingRelations(true);
    const loginClient = await getLoginClient();
    loginClient
      .get('index/relation?include_man=1&include_woman=1&gender=woman')
      .then((response) => {
        setLoadingRelations(false);
        if (response.data.is_successful) {
          let rels = [];
          let activeRel = null;
          setRelations(response.data.data);
          response.data.data.map((rel) => {
            rels.push({
              label: rel.man_name ? rel.man_name : 'بدون نام',
              value: rel.id,
              is_active: rel.is_active,
              is_verified: rel.is_verified,
            });
            if (rel.is_active === 1 && rel.id === Number(lastActiveRel)) {
              activeRel = rel;
            }
          });
          if (activeRel) {
            saveActiveRel({
              relId: activeRel.id,
              label: activeRel.man_name,
              image: activeRel.man_image,
              mobile: activeRel.man.mobile,
              birthday: activeRel.man.birth_date,
            });
          }
          AsyncStorage.setItem('rels', JSON.stringify(rels));
          saveWomanRelations(rels);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      });
  };

  const renderRelations = function ({ item }) {
    return (
      <RelItem
        rel={item}
        handleShowDeleteModal={handleDeleteRel}
        handleVerifyRel={handleVerifyRel}
        updateRels={() => setShouldUpdate(!shouldUpdate)}
        isVerifying={verifyCode.isFetching}
      />
    );
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const handleVerifyRel = async (code) => {
    verificationCode.current = code;
    await setVerifyCode();
  };

  useEffect(() => {
    if (verifyCode.data && verifyCode.data.is_successful) {
      setShouldUpdate(!shouldUpdate);
      setSnackbar({
        msg: 'رابطه شما با موفقیت تایید شد.',
        visible: true,
        type: 'success',
      });
    }
    if (verifyCode.data && !verifyCode.data.is_successful) {
      setSnackbar({
        msg:
          verifyCode.data.status === 404
            ? 'رابطه ای با این کد تایید ثبت نشده است.'
            : 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
    }
  }, [verifyCode]);

  const handleDeleteRel = (id) => {
    setShowDeleteModal({ show: true, id: id });
  };

  useEffect(() => {
    getRelations();
  }, [shouldUpdate]);

  return (
    <BackgroundView>
      <ScreenHeader title="روابط من" />
      {loadingRelations && (
        <ActivityIndicator
          size="small"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.primary}
          style={{ marginTop: rh(2), marginBottom: rh(2) }}
        />
      )}
      {!loadingRelations && relations.length ? (
        <View style={{ height: rh(30) }}>
          <FlatList
            data={relations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRelations}
            style={{ marginTop: rh(2), marginBottom: rh(2), height: rh(10) }}
          />
        </View>
      ) : null}
      {!loadingRelations && !relations.length ? (
        <Text marginTop={rh(2)} marginBottom={rh(2)}>
          شما هیچ رابطه ای ثبت نکرده اید
        </Text>
      ) : null}

      <Divider
        color={COLORS.textDark}
        width={rw(80)}
        style={{ borderBottomWidth: 0.6, marginTop: rh(1) }}
      />

      <View style={styles.addRelContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate('AddRel', {
              handleUpdateRels: () => setShouldUpdate(!shouldUpdate),
            })
          }
          hitSlop={7}>
          <Image
            source={require('../../assets/icons/drawerSettings/next-page.png')}
          />
        </Pressable>
        <View style={{ flexDirection: 'row' }}>
          <Text marginRight={rw(3)}>افزودن رابطه جدید</Text>
          <Image
            source={require('../../assets/icons/drawerSettings/addNewPerson-menu.png')}
          />
        </View>
      </View>

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
      {showDeleteModal.show && (
        <DeleteModal
          type="rel"
          title="پارتنر"
          visible={showDeleteModal.show}
          closeModal={() => setShowDeleteModal({ show: false, id: null })}
          id={showDeleteModal.id}
          updateData={getRelations}
          setSnackbar={setSnackbar}
        />
      )}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
    alignItems: 'center',
    width: rw(100),
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(100),
    marginTop: rh(2),
    paddingBottom: rh(4),
  },
  image: {
    width: 100,
    height: 100,
    marginTop: rh(2),
  },
  addRelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(2),
    width: rw(82),
    marginTop: rh(3),
  },
});

export default RelationsScreen;
