import React from 'react';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const HomeDivider = () => {
  const { systemSetting } = useMyContext();
  const navigate = useNavigate();

  if (!systemSetting?.home_divider) return null;

  let dividerLink = null;
  try {
    dividerLink = systemSetting?.home_divider_url
      ? JSON.parse(systemSetting.home_divider_url)
      : null;
  } catch (error) {
    console.error("Invalid JSON in home_divider_url", error);
  }

  const handleClick = () => {
    const url = dividerLink?.url;
    if (!url) return;

    const isExternal = url.startsWith('http://') || url.startsWith('https://');

    if (isExternal) {
      window.open(url, dividerLink?.new_tab ? '_blank' : '_self');
    } else {
      navigate(url);
    }
  };

  return (
    <Container fluid className="my-4 text-center">
      <img
        src={systemSetting.home_divider}
        alt="Home Divider"
        onClick={handleClick}
        style={{
          maxWidth: '90%',
          height: 'auto',
          cursor: dividerLink?.url ? 'pointer' : 'default',
          transition: 'transform 0.2s ease-in-out',
        }}
        onMouseOver={(e) => {
          if (dividerLink?.url) e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
    </Container>
  );
};

export default HomeDivider;
