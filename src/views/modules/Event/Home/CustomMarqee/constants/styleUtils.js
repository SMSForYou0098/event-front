export const getContentStyle = (speed, isPaused) => ({
    display: 'inline-block',
    animation: `marquee ${speed}s linear infinite`,
    animationPlayState: isPaused ? 'paused' : 'running',
  });
  
  export const getImageStyle = (width) => ({
    display: 'inline-block',
    width,
    margin : '0 1rem'
  });