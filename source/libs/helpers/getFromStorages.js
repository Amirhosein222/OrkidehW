import AsyncStorage from '@react-native-async-storage/async-storage';

export function getFromAsyncStorage(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key)
      .then((res) => {
        if (res !== null) {
          resolve(res);
        } else {
          resolve(false);
        }
      })
      .catch((err) => reject(err));
  });
}
