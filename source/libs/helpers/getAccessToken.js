import AsyncStorage from '@react-native-async-storage/async-storage';

const getAccessToken = async () => {
  try {
    const retrievedToken = await AsyncStorage.getItem('userToken');
    if (retrievedToken !== null) {
      const token = JSON.parse(retrievedToken);
      const authorization = `Bearer ${token}`;
      // We have data!!
      return authorization;
    }
    return null;
  } catch (error) {
    // Error retrieving data
  }
};

export default getAccessToken;
