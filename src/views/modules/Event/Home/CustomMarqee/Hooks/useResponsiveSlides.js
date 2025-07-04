import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constants/breakpoints';

const useResponsiveSlides = () => {
  const [slidesToShow, setSlidesToShow] = useState(6);

  useEffect(() => {
    const updateSlidesCount = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.sm) {
        setSlidesToShow(2);
      } else if (width < BREAKPOINTS.md) {
        setSlidesToShow(2);
      } else if (width < BREAKPOINTS.lg) {
        setSlidesToShow(4);
      } else if (width < BREAKPOINTS.xl) {
        setSlidesToShow(4);
      } else {
        setSlidesToShow(8);
      }
    };

    updateSlidesCount();
    window.addEventListener('resize', updateSlidesCount);
    return () => window.removeEventListener('resize', updateSlidesCount);
  }, []);

  return { slidesToShow };
};

export default useResponsiveSlides;