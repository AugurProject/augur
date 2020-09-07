import { useState, useEffect } from 'react';

export const useWindowDimensions= () => {
  const hasWindow = typeof window !== 'undefined';

  const nullWidthAndHeight = {
    width: null,
    height: null,
  };

  const getWindowDimensions = () => {
    if (!hasWindow) return nullWidthAndHeight;

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
    };
  };

  const handleResize = () => setWindowDimensions(getWindowDimensions());

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (!hasWindow) return null;

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasWindow]);

  return windowDimensions;
};
