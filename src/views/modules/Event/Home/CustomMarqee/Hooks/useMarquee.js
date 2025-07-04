import { useState } from 'react';

const useMarquee = () => {
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return {
    isPaused,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useMarquee;