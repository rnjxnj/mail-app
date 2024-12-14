import React from 'react';

const Sidebar = ({ onSectionSelect }) => {
  return (
    <aside style={sidebarStyles}>
      <button style={buttonStyles} onClick={() => onSectionSelect('inbox')}>Входящие</button>
      <button style={buttonStyles} onClick={() => onSectionSelect('sent')}>Отправленные</button>
      {/* <button style={buttonStyles} onClick={() => onSectionSelect('drafts')}>Черновики</button> */}
    </aside>
  );
};

const sidebarStyles = {
    width: '200px',
    padding: '10px',
    backgroundColor: '#f1f1f1',
    height: '100vh',
    position: 'fixed',
    top: '80px', // Отступ под хедер
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
};

const buttonStyles = {
    width: '130px',
    margin: '0 auto'
};

export default Sidebar;
