import React from 'react';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const HomeDivider = () => {
  const { systemSetting } = useMyContext();
  const navigate = useNavigate();

  if (!systemSetting?.home_divider) return null;

  return (
    <Container fluid className="my-4 text-center">
      <img
        src={systemSetting?.home_divider}
        alt="Home Divider"
        onClick={() => systemSetting?.home_divider_url && navigate(systemSetting.home_divider_url)}
        style={{
          maxWidth: '90%',
          height: 'auto',
          cursor: systemSetting?.home_divider_url ? 'pointer' : 'default',
          transition: 'transform 0.2s ease-in-out',
        }}
        onMouseOver={(e) => {
          if (systemSetting?.home_divider_url) e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
    </Container>
  );
};

export default HomeDivider;
