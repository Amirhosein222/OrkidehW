import moment from 'moment-jalaali';

export default function calcDiffDays(d) {
  const date = moment(d, 'X').locale('en').format('jYYYY/jM/jD');
  const formatted = moment(date, 'jYYYY/jM/jD');

  const result = moment(formatted).diff(moment(new Date()), 'days');
  return Math.abs(result);
}
