import React, { useEffect, useState } from 'react';
import moment from 'moment-jalaali';

import { getRelationsApi } from '../../screens/home/apis';
import Icon from '../../assets/icons/drawerSettings/addNewPerson-menu.svg';
import { ICON_SIZE } from '../../configs';
import { useApi } from '../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WomanInfoContext = React.createContext();

let saveWomanRelations;
let saveFullInfo;
let saveActiveRel;

const WomanInfoProvider = function ({ children }) {
  const [rels, setRels] = useState([]);
  const [fullInfo, setFullInfo] = useState(null);
  const [periodInfo, setPeriodInfo] = useState(null);
  const [activeRel, setActiveRel] = useState(null);
  const [registerStage, setRegisterStage] = useState(0);
  const [userCalendar, setUserCalendar] = useState(null);
  const [userPeriodDays, setUserPeriodDays] = useState(null);
  const [isPeriodDay, setIsPeriodDay] = useState(false);
  const [settings, setSettings] = useState(null);
  const [allSettings, setAllSettings] = useState(null);
  const [getRelations, setGetRelations] = useApi(() => getRelationsApi());

  saveWomanRelations = function (relations) {
    setRels(relations);
  };

  saveFullInfo = function (info) {
    setFullInfo(info);
  };

  saveActiveRel = function (rel) {
    setActiveRel(rel);
  };

  const saveSettings = sets => {
    setSettings(sets);
  };

  const saveAllSettings = sets => {
    setAllSettings(sets);
  };

  const handleRegisterStage = stage => {
    setRegisterStage(stage);
  };

  const savePeriodInfo = info => {
    setPeriodInfo(info);
  };

  const handleUserPeriodDays = pDays => {
    setUserPeriodDays(pDays);
    const today = moment().locale('en').format('YYYY-MM-DD');
    const result = pDays.find(
      d => moment(d.date, 'X').locale('en').format('YYYY-MM-DD') === today,
    );
    setIsPeriodDay(result ? true : false);
  };

  const handleUserCalendar = calendar => {
    setUserCalendar(calendar);
  };

  const handleRels = async function () {
    const lastActiveRel = await AsyncStorage.getItem('lastActiveRelId');
    saveActiveRel(null);
    let relations = [];
    let activeRell = null;
    getRelations.data.data.map(rel => {
      relations.push({
        label: rel.man_name ? rel.man_name : 'بدون نام',
        value: rel.id,
        is_active: rel.is_active,
        is_verified: rel.is_verified,
        image: rel.man_image,
        mobile: rel.man.mobile,
        birthday: rel.man.birth_date,
        applicant: rel.applicant,
        verifyCode: rel.verification_code,
      });
      if (rel.is_active === 1 && rel.id === Number(lastActiveRel)) {
        activeRell = rel;
      }
    });
    if (activeRell) {
      saveActiveRel({
        relId: activeRell.id,
        label: activeRell.man_name,
        image: activeRell.man_image,
        mobile: activeRell.man.mobile,
        birthday: activeRell.man.birth_date,
      });
    }
    saveWomanRelations([
      ...relations,
      {
        label: 'افزودن رابطه جدید',
        value: 'newRel',
        icon: () => <Icon style={ICON_SIZE} />,
        id: 0,
      },
    ]);
  };

  useEffect(() => {
    setRels([
      {
        label: 'افزودن رابطه جدید',
        value: 'newRel',
        icon: () => <Icon style={ICON_SIZE} />,
      },
    ]);
    setGetRelations();
  }, []);

  useEffect(() => {
    if (getRelations.data && getRelations.data.is_successful) {
      handleRels();
    }
  }, [getRelations]);

  const getAndHandleRels = () => {
    setGetRelations();
  };

  return (
    <WomanInfoContext.Provider
      value={{
        relations: rels,
        fullInfo: fullInfo,
        saveFullInfo,
        activeRel: activeRel,
        registerStage,
        handleRegisterStage,
        handleUserPeriodDays,
        userPeriodDays,
        isPeriodDay,
        userCalendar,
        handleUserCalendar,
        settings,
        saveSettings,
        periodInfo,
        savePeriodInfo,
        allSettings,
        saveAllSettings,
        getAndHandleRels,
        fetchingRels: getRelations.isFetching,
      }}>
      {children}
    </WomanInfoContext.Provider>
  );
};

export {
  WomanInfoContext,
  WomanInfoProvider,
  saveWomanRelations,
  saveFullInfo,
  saveActiveRel,
};
