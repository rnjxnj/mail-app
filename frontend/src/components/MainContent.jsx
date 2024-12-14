import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FetchEmailsButton from '../components/FetchEmailsButton';

const MainContent = ({ currentSection = 'inbox' }) => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null); // Для открытия полного письма
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByRead, setFilterByRead] = useState('all');

  useEffect(() => {
    if (currentSection) {
      fetchEmails();
      setSelectedEmail(null); // Закрываем выбранное письмо при смене раздела
    }
  }, [currentSection]);

  useEffect(() => {
    applyFilters();
  }, [emails, searchQuery, filterByRead]);

  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    try {
        
      const response = await axios.get(`/api/emails/${currentSection}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const fetchedEmails = response.data;
      setEmails(fetchedEmails);
    } catch (err) {
      console.error('Ошибка при загрузке писем:', err);
      setError('Не удалось загрузить письма.');
    }
    setLoading(false);
  };

  const handleEmailClick = (email) => {
    
    setSelectedEmail(email);
    if (!email.isRead) {
        markAsRead(email._id);
      }
  };

  const markAsRead = async (emailId) => {
    try {
      // Отправляем PATCH-запрос для обновления статуса письма
      await axios.patch(import.meta.env.VITE_API_URL + `/api/emails/${emailId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Передаём токен авторизации
        },
      });
  
      // После успешного запроса обновляем состояние на клиенте
      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, isRead: true } : email
        )
      );
    } catch (err) {
      console.error('Ошибка при отметке письма как прочитанного:', err);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...emails];

    // Поиск по ключевым словам
    if (searchQuery) {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтрация по статусу
    if (filterByRead === 'read') {
        filtered = filtered.filter((email) => email.isRead);
      } else if (filterByRead === 'unread') {
        filtered = filtered.filter((email) => !email.isRead);
      }
  
      setFilteredEmails(filtered);
    };
  
    return (
        <main style={mainContentStyles}>
          <div style={headerContainerStyles}>
            <h1>{getSectionTitle(currentSection)}</h1>
            {currentSection === 'inbox' && <FetchEmailsButton onFetchEmails={fetchEmails} />}
          </div>
          <div style={filtersStyles}>
            <input
              type="text"
              placeholder="Поиск писем..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyles}
            />
            {currentSection === 'inbox' && (
              <select
                value={filterByRead}
                onChange={(e) => setFilterByRead(e.target.value)}
                style={selectStyles}
              >
                <option value="all">Все</option>
                <option value="read">Прочитанные</option>
                <option value="unread">Непрочитанные</option>
              </select>
            )}
          </div>
      
          {loading ? (
            <p>Загрузка...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : selectedEmail ? (
            <div style={emailDetailsStyles}>
              <button onClick={() => setSelectedEmail(null)} style={backButtonStyles}>
                Назад
              </button>
              <h2>{selectedEmail.subject}</h2>
              <p>
                <strong>От:</strong> {selectedEmail.sender}
              </p>
              <p>
                <strong>Дата:</strong> {new Date(selectedEmail.dateSent).toLocaleString()}
              </p>
              <div style={emailBodyStyles}>{selectedEmail.body}</div>
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div>
                  <h4>Вложения:</h4>
                  <ul>
                    {selectedEmail.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a href={attachment.filepath} target="_blank" rel="noopener noreferrer">
                          {attachment.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : filteredEmails.length > 0 ? (
            <div style={emailListStyles}>
              {filteredEmails.map((email) => (
                <div
                  key={email._id}
                  style={{
                    ...emailItemStyles,
                    fontWeight: email.isRead ? 'normal' : 'bold',
                  }}
                  onClick={() => handleEmailClick(email)}
                >
                  <div style={emailHeaderStyles}>
                    <strong>{email.sender}</strong>
                    <span style={emailDateStyles}>
                      {new Date(email.dateSent).toLocaleString()}
                    </span>
                  </div>
                  <div style={emailSubjectStyles}>{email.subject}</div>
                  <div style={emailSnippetStyles}>{email.body.slice(0, 100)}...</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Нет писем, соответствующих вашему запросу.</p>
          )}
        </main>
      );
      
};

const filtersStyles = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  };
  
  const searchInputStyles = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    width: '70%',
  };
  
  const selectStyles = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  };

const headerContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '20px',
    padding: '0px',
    width: '100vw',
};
    

const getSectionTitle = (section) => {
  switch (section) {
    case 'inbox':
      return 'Входящие';
    case 'sent':
      return 'Отправленные';
    case 'drafts':
      return 'Черновики';
    default:
      return 'Не найден раздел';
  }
};

const mainContentStyles = {
  padding: '20px 20px 20px 220px',
  backgroundColor: '#f9f9f9',
  height: '100vh',
  overflowY: 'auto',
  margin: '100px 0px 10px',
  width: '100vw',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',

};

const emailListStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: '10px',
};

const emailItemStyles = {
  maxWidth: '80%',
  border: '1px solid #ddd',
  padding: '15px',
  borderRadius: '4px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const emailHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: '#555',
  marginBottom: '5px',
};

const emailDateStyles = {
  color: '#999',
  fontSize: '12px',
};

const emailSubjectStyles = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '5px',
};

const emailSnippetStyles = {
  fontSize: '14px',
  color: '#666',
};

const emailDetailsStyles = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '20px',
  marginTop: '10px',
};

const emailBodyStyles = {
  marginTop: '20px',
  fontSize: '14px',
  color: '#333',
};

const backButtonStyles = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginBottom: '20px',
};

export default MainContent;
