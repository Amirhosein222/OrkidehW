import { useContext } from 'react';
import { WomanInfoContext } from '../context/womanInfoContext';

export default function useFullInfo() {
  const { fullInfo } = useContext(WomanInfoContext);

  return fullInfo;
}
