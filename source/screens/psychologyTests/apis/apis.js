import getLoginClient from '../../../libs/api/loginClientApi';

export const getTestsApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get('test/list/index?gender=woman');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getTestDetailsApi = async function (testId) {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      `test/show?test_id=${testId}&gender=woman`,
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const submitAnswersApi = async function (selectedChoices) {
  // console.log('sending answers ', selectedChoices);
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.post('test/answer', selectedChoices);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
