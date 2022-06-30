import React, { useState, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MainContext = createContext();

export function MainContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  const changeUserRole = (role) => {
    setUserRole(role);
  };

  const handleToken = (token: string) => {
    setToken(token);
  };

  const handleUserInfo = (info) => {
    setUserInfo(info);
  };

  return (
    <MainContext.Provider
      value={{
        handleToken,
        userInfo,
        handleUserInfo,
      }}>
      {children}
    </MainContext.Provider>
  );
}
