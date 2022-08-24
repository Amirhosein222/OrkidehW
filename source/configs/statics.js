import moment from 'moment-jalaali';

const months = [
  { label: 'فروردین', value: '01' },
  { label: 'اردیبهشت', value: '02' },
  { label: 'خرداد', value: '03' },
  { label: 'تیر', value: '04' },
  { label: 'مرداد', value: '05' },
  { label: 'شهریور', value: '06' },
  { label: 'مهر', value: '07' },
  { label: 'آبان', value: '08' },
  { label: 'آذر', value: '09' },
  { label: 'دی', value: '10' },
  { label: 'بهمن', value: '11' },
  { label: 'اسفند', value: '12' },
];

const days = [
  { label: '1', value: '01' },
  { label: '2', value: '02' },
  { label: '3', value: '03' },
  { label: '4', value: '04' },
  { label: '5', value: '05' },
  { label: '6', value: '06' },
  { label: '7', value: '07' },
  { label: '8', value: '08' },
  { label: '9', value: '09' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
  { label: '20', value: '20' },
  { label: '21', value: '21' },
  { label: '22', value: '22' },
  { label: '23', value: '23' },
  { label: '24', value: '24' },
  { label: '25', value: '25' },
  { label: '26', value: '26' },
  { label: '27', value: '27' },
  { label: '28', value: '28' },
  { label: '29', value: '29' },
  { label: '30', value: '30' },
  { label: '31', value: '31' },
];

const getYears = (startYear) => {
  var currentYear = moment().locale('en').format('jYYYY'),
    years = [];
  startYear = startYear || 1340;
  while (startYear <= currentYear) {
    startYear++;
    years.push({ label: String(startYear), value: String(startYear) });
  }
  return years;
};

const dayNumbers = [
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
];

export { months, days, getYears, dayNumbers };
