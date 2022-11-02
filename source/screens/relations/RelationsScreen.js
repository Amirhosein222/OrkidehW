/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
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

import {
  saveWomanRelations,
  saveActiveRel,
} from '../../libs/context/womanInfoContext';

import { COLORS, rh, rw } from '../../configs';
import { useApi, useIsPeriodDay } from '../../libs/hooks';
import { getRelsApi } from './apis';
import { verifyRelation } from '../../libs/apiCalls';

import AddPerson from '../../assets/icons/drawerSettings/addNewPerson-menu.svg';
import NextIcon from '../../assets/icons/drawerSettings/nextPage.svg';

const RelationsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();

  const verificationCode = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    id: null,
  });
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [verifyCode, setVerifyCode] = useApi(() =>
    verifyRelation(verificationCode.current),
  );
  const [rels, setRels] = useApi(() => getRelsApi());

  const handleRels = async function () {
    const lastActiveRel = await AsyncStorage.getItem('lastActiveRelId');
    saveActiveRel(null);
    let relations = [];
    let activeRel = null;
    rels.data.data.map(rel => {
      relations.push({
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
    AsyncStorage.setItem('rels', JSON.stringify(relations));
    saveWomanRelations(relations);
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

  const handleVerifyRel = async code => {
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

  useEffect(() => {
    if (rels.data && rels.data.is_successful) {
      handleRels();
    }
    rels.data &&
      !rels.data.is_successful &&
      setSnackbar({
        msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
        visible: true,
      });
  }, [rels]);

  const handleDeleteRel = id => {
    setShowDeleteModal({ show: true, id: id });
  };

  useEffect(() => {
    setRels();
  }, [shouldUpdate]);

  return (
    <BackgroundView>
      <ScreenHeader title="روابط من" />
      {rels.isFetching && (
        <ActivityIndicator
          size="small"
          color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
          style={{ marginTop: rh(2), marginBottom: rh(2) }}
        />
      )}
      {rels.data && rels.data.data.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={rels.data.data}
          keyExtractor={item => item.id.toString()}
          renderItem={renderRelations}
          style={{
            flexGrow: 0,
            marginTop: rh(2),
            marginBottom: rh(2),
          }}
        />
      ) : null}
      {!rels.isFetching && rels.data && !rels.data.data.length ? (
        <Text marginTop={rh(2)} marginBottom={rh(2)}>
          شما هیچ رابطه ای ثبت نکرده اید
        </Text>
      ) : null}

      <Divider
        color={COLORS.textDark}
        width={rw(76)}
        style={{
          borderBottomWidth: 0.5,
          marginTop: rh(1),
          marginBottom: rh(2),
        }}
      />

      <View style={styles.addRelContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate('AddRel', {
              handleUpdateRels: () => setShouldUpdate(!shouldUpdate),
            })
          }
          hitSlop={7}>
          <NextIcon style={{ width: 25, height: 25 }} />
        </Pressable>
        <View style={{ flexDirection: 'row' }}>
          <Text marginRight={rw(2)}>افزودن رابطه جدید</Text>
          <AddPerson style={{ width: 25, height: 25 }} />
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
          updateData={setRels}
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
    paddingHorizontal: rw(1),
    width: rw(82),
    marginTop: rh(1),
    marginBottom: rh(4),
  },
});

export default RelationsScreen;
