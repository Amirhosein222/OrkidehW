import moment from 'moment';
import momentJ from 'moment-jalaali';

const getDates = function (firstDay) {
  const startOfWeek = firstDay
    ? moment(firstDay, 'X').utc()
    : moment().subtract(2, 'month').startOf('day');
  const endOfWeek = moment().endOf('day');

  let days = [];
  let day = startOfWeek;

  while (day <= endOfWeek) {
    days.push(momentJ(day).locale('en').format('jYYYY/jMM/jDD'));
    day = day.clone().add(1, 'd');
  }
  return days;
};

export default getDates;
