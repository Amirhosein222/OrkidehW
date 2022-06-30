import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';

import MainStackNavigator from './routes/MainStackNavigator';

import { getFromAsyncStorage } from './libs/helpers';
import { WomanInfoProvider } from './libs/context/womanInfoContext';

const App = () => {
  const [checkingIsLoggedin, setCheckingIsLoggedin] = useState(true);
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    getFromAsyncStorage('userToken')
      .then((result) => {
        setIsLoggedin(result);
        setCheckingIsLoggedin(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  if (checkingIsLoggedin === true) {
    return null;
  } else {
    return (
      <WomanInfoProvider>
        <MainStackNavigator isLoggedin={isLoggedin} />
      </WomanInfoProvider>
    );
  }
};

export default App;
