import { useEffect } from 'react';

const useAsyncEffect = <T>(effect: () => void, dependencies?: Array<T>) => {
  useEffect(() => {
    Promise.resolve(effect());
  }, dependencies);
};

export default useAsyncEffect;
