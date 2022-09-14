import getWomanClient from '../../../libs/api/womanApi';
import getLoginClient from '../../../libs/api/loginClientApi';

export const getCalendarApi = async function () {
  try {
    const womanClient = await getWomanClient();
    const res = await womanClient.get('show/calendar');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getPregnancyPercentApi = async function (activeRel) {
  console.log('activeRel ', activeRel);

  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('relation_id', activeRel);
    const res = await loginClient.post('formula/pregnancy', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const storePeriodAutoApi = async function (date) {
  try {
    const womanClient = await getWomanClient();
    const formData = new FormData();
    formData.append('date', date);
    const res = await womanClient.post('store/period/auto', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getRelationsApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      'index/relation?include_man=1&include_woman=1&gender=woman',
    );
    console.log('rels res ', res.data);

    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
