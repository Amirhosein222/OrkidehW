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
