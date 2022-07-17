import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

import MainStackNavigator from './routes/MainStackNavigator';

import { getFromAsyncStorage } from './libs/helpers';
import { WomanInfoProvider } from './libs/context/womanInfoContext';

Orientation.lockToPortrait();

const App = () => {
  const [checkingIsLoggedin, setCheckingIsLoggedin] = useState(true);
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    getFromAsyncStorage('logedOut')
      .then((result) => {
        if (result === 'true') {
          setIsLoggedin(false);
          setCheckingIsLoggedin(false);
        } else {
          getFromAsyncStorage('userToken')
            .then((res) => {
              setIsLoggedin(res);
              setCheckingIsLoggedin(false);
            })
            .catch((e) => {
              console.log(e);
            });
        }
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
