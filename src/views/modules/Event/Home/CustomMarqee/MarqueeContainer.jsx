import React from 'react';
import { Container } from 'react-bootstrap';
import MarqueeContent from './MarqueeContent';

import { CONTAINER_STYLES } from './constants/styles';
import './styles/marquee.css';
import useMarquee from './Hooks/useMarquee';
import useResponsiveSlides from './Hooks/useResponsiveSlides';

const MarqueeContainer = ({ images, speed = 30 }) => {
  const { isPaused, handleMouseEnter, handleMouseLeave } = useMarquee();
  const { slidesToShow } = useResponsiveSlides();

  return (
    <Container fluid className="p-0">
      <div
        className="marquee-container slider-circle-btn"
        style={CONTAINER_STYLES}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
      </div>
    </Container>
  );
};

export default MarqueeContainer;