import React from 'react';
import { getContentStyle } from './constants/styleUtils';
import ImageCard from './constants/ImageCard';


const MarqueeContent = ({ images, speed, isPaused, slidesToShow }) => {
  const contentStyle = getContentStyle(speed, isPaused);
  const imageWidth = `${100 / slidesToShow}%`;

  return (
    <div className="marquee-content" style={contentStyle}>
      {images?.map((image, index) => (
        <ImageCard
          key={index}
          src={image}
          width={imageWidth}
        />
      ))}
    </div>
  );
};

export default MarqueeContent;