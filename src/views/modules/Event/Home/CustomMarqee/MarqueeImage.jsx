import React from 'react';
import { getImageStyle } from './constants/styleUtils';

const MarqueeImage = ({ src, width }) => {
  const imageStyle = getImageStyle(width);

  return (
    <div className="card card-slide overflow-hidden" style={imageStyle}>
      <img
        src={src}
        alt="category"
        className="img-fluid"
        loading="lazy"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default MarqueeImage;