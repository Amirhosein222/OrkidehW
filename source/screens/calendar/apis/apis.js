import getWomanClient from '../../../libs/api/womanApi';

export const getDaysGroupedWithCycles = async function () {
  const womanClient = await getWomanClient();
  try {
    const res = await womanClient.get(
      'https://orkidehapp.ir/api/woman/show/calendar/grouped_with_cycle',
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
