import { useContext } from 'react';
import { WomanInfoContext } from '../context/womanInfoContext';

export default function useIsPeriodDay() {
  const { isPeriodDay } = useContext(WomanInfoContext);
  return isPeriodDay;
}
