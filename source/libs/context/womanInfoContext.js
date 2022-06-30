import React, { useState } from 'react';
import moment from 'moment-jalaali';

const WomanInfoContext = React.createContext();

let saveWomanRelations;
let saveFullInfo;
let saveActiveRel;

const WomanInfoProvider = function ({ children }) {
  const [rels, setRels] = useState([]);
  const [fullInfo, setFullInfo] = useState([]);
  const [activeRel, setActiveRel] = useState(null);
  const [registerStage, setRegisterStage] = useState(0);
  const [userCalendar, setUserCalendar] = useState(null);
  const [userPeriodDays, setUserPeriodDays] = useState(null);
  const [isPeriodDay, setIsPeriodDay] = useState(false);

  saveWomanRelations = function (relations) {
    setRels(relations);
  };

  saveFullInfo = function (info) {
    setFullInfo(info);
  };

  saveActiveRel = function (rel) {
    setActiveRel(rel);
  };

  const handleRegisterStage = (stage) => {
    setRegisterStage(stage);
  };

  const handleUserPeriodDays = (pDays) => {
    setUserPeriodDays(pDays);
    const today = moment().locale('en').format('YYYY-MM-DD');
    const result = pDays.find(
      (d) => moment(d.date, 'X').locale('en').format('YYYY-MM-DD') === today,
    );
    setIsPeriodDay(result ? true : false);
  };

  const handleUserCalendar = (calendar) => {
    setUserCalendar(calendar);
  };

  return (
    <WomanInfoContext.Provider
      value={{
        relations: rels,
        fullInfo: { ...fullInfo },
        activeRel: activeRel,
        registerStage,
        handleRegisterStage,
        handleUserPeriodDays,
        userPeriodDays,
        isPeriodDay,
        userCalendar,
        handleUserCalendar,
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
