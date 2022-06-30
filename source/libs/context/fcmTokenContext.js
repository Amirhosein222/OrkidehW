import React, { useState } from 'react';

const FcmTokenContext = React.createContext();

let saveFcmToken;

const FcmTokenProvider = function ({ children }) {
  const [token, setToken] = useState({});

  saveFcmToken = function (fcmToken) {
    setToken(fcmToken);
  };

  return (
    <FcmTokenContext.Provider
      value={{
        fcmToken: token,
      }}>
      {children}
    </FcmTokenContext.Provider>
  );
};

export { FcmTokenContext, FcmTokenProvider, saveFcmToken };
