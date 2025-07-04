import React from 'react';
import MarqueeContent from './MarqueeContent';

const MarqueeTrack = ({ images, speed, isPaused, slidesToShow }) => {
  return (
    <>
      <MarqueeContent
        images={images} 
        speed={speed} 
        isPaused={isPaused}
        slidesToShow={slidesToShow}
      />
      <MarqueeContent 
        images={images}
        speed={speed} 
        isPaused={isPaused}
        slidesToShow={slidesToShow}
      />
    </>
  );
};

export default MarqueeTrack;