import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

import MainStackNavigator from './routes/MainStackNavigator';

import { WomanInfoProvider } from './libs/context/womanInfoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

Orientation.lockToPortrait();

const App = () => {
  const [checkingIsLoggedin, setCheckingIsLoggedin] = useState(true);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [hasPassOrFinger, setHasPassOrFinger] = useState(false);

  const handleRenederInitialScreen = async () => {
    const hasToken = await AsyncStorage.getItem('userToken');
    if (!hasToken) {
      setIsLoggedin(false);
      setCheckingIsLoggedin(false);
      return;
    }
    const hasPass = await AsyncStorage.getItem('isPassActive');
    const hasFinger = await AsyncStorage.getItem('isFingerActive');
    if (hasPass || hasFinger) {
      setHasPassOrFinger(true);
    }
    setIsLoggedin(true);
    setCheckingIsLoggedin(false);
  };

  useEffect(() => {
    handleRenederInitialScreen();
  }, []);

  if (checkingIsLoggedin === true) {
    return null;
  } else {
    return (
      <WomanInfoProvider>
        <MainStackNavigator
          isLoggedin={isLoggedin}
          showAuth={hasPassOrFinger}
        />
      </WomanInfoProvider>
    );
  }
};

export default App;
