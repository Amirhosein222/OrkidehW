import axios from 'axios';
import { getAccessToken } from '../helpers';
import getLoginClient from '../api/loginClientApi';
import getWomanClient from '../api/womanApi';

export const verifyRelation = async function (code) {
  try {
    const token = await getAccessToken();
    const res = await axios.get(
      `https://orkidehapp.ir/verify/relation?code=${code}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const buyGoldenAccount = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      'payment/buy/account_type_golden?gender=woman',
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const getSettings = async function (key) {
  console.log('getting settings');
  try {
    const res = await axios.get('https://orkidehapp.ir/api/setting');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const getWomanInfo = async function () {
  try {
    const womanClient = await getWomanClient();
    const res = await womanClient.get('login_woman');
    console.log('login woman ', res.data);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};
