import axios from 'axios';
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

const loginClient = axios.create({
  baseURL: 'https://orkidehapp.ir/api/user/',
  headers: {
    Accept: 'application/json',
  },
});
loginClient.defaults.headers.post['Content-Type'] = 'multipart/form-data';

const getLoginClient = async () => {
  loginClient.defaults.headers.common.Authorization = await getAccessToken();
  return loginClient;
};

// Intercept all request
// loginClient.interceptors.request.use(
//   config => {
//     console.log('configs: ', config);
//     return config;
//   },
//   error => Promise.reject(error),
// );

// Intercept all responses
loginClient.interceptors.response.use(
  async response => {
    if (response.status === 401) {
      try {
        const value = await AsyncStorage.getItem('userToken');
        if (value !== null) {
          // We have data!!
          AsyncStorage.clear();
        }
      } catch (error) {
        // Error retrieving data
        console.log(error, 'logged in client error');
      }
    }
    return response;
  },
  error => {
    console.error(error);
    return Promise.reject(error);
  },
);
export default getLoginClient;
