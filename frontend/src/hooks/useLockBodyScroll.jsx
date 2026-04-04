import { useEffect } from 'react';

const useLockBodyScroll = (isLocked) => {
  useEffect(() => {
    document.body.style.overflow = isLocked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isLocked]);
};

export default useLockBodyScroll;