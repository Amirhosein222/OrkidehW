import getLoginClient from '../../../libs/api/loginClientApi';

export const getSymptomsApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get('get/all/signs?gender=woman');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getExpectationsFromSpouseApi = async function (activeRel) {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      `index/expectation?relation_id=${activeRel}&gender=woman`,
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getMyExpectationsFromSpouseApi = async function (activeRel) {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      `today/my/expectation?relation_id=${activeRel}&include_expectation=1&gender=woman`,
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getMySignsApi = async function (moodDate) {
  console.log('m', moodDate);
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'woman');
    formData.append('date', moodDate);
    formData.append('include_sign', 1);
    formData.append('include_mood', 1);
    const res = await loginClient.post('show/my/moods', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const storeExpectationApi = async function (expId, activeRel) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('expectation_id', expId);
    formData.append('relation_id', activeRel);
    formData.append('gender', 'woman');
    const res = await loginClient.post('store/expectation', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
