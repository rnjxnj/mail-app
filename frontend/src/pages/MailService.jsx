import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';

const MailService = () => {
  const [currentSection, setCurrentSection] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSectionSelect = (section) => {
    setCurrentSection(section);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <Header />
      <Sidebar onSectionSelect={handleSectionSelect} />
      <MainContent currentSection={currentSection} />
    </div>
  );
};

export default MailService;
