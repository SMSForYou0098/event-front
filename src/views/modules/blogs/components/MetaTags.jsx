import React from 'react';
import { Helmet } from 'react-helmet-async';


const MetaTags= ({
  title = 'Default Title',
  description = 'Default description',
  image = 'default-image-url.jpg',
  keywords = [],
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  );
};

export default MetaTags;
