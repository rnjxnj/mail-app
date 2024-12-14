import React from 'react';
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header style={headerStyles}>
      <div style={leftSectionStyles}>
        <button style={buttonStyles} onClick={() => navigate('/mail/compose')}>Отправить письмо</button>
        <button style={logoutButtonStyles} onClick={() => navigate('/profile')}>Профиль</button>
      </div>
      <button style={logoutButtonStyles} onClick={handleLogout}>Выйти</button>
    </header>
  );
};

const buttonStyles = {
    padding: '10px 20px',
    margin: '10px 0',
    backgroundColor: 'blue',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    position: 'fixed',
    top: '0',
    zIndex: '1000',
    width: '100%',
    left: '0',
    height: '60px',
    // boxSizing: 'border-box',
};

const leftSectionStyles = {
    display: 'flex',
    gap: '10px',
};

const logoutButtonStyles = {
    padding: '10px 20px',
    margin: '10px 0',
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginRight: '40px',
};

export default Header;
