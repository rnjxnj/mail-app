import React from 'react';
import axios from 'axios';

function FetchEmailsButton({ onFetchEmails }) {
  const fetchEmails = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + '/api/emails/fetch', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Ответ от сервера:', response.data);
      alert('Процесс получения писем успешно запущен.');

      // Обновление ящика после успешного получения писем
      if (onFetchEmails) {
        onFetchEmails();
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      alert(
        error.response
          ? `Ошибка: ${error.response.data.message || 'Не удалось выполнить запрос.'}`
          : 'Произошла ошибка при выполнении запроса.'
      );
    }
  };

  return (
    <button style={btnFetch} onClick={fetchEmails}>
      Получить новые письма
    </button>
  );
}

const btnFetch = {
  color: '#000',
  padding: '5px 10px',
  cursor: 'pointer',
  backgroundColor: 'transparent',
};

export default FetchEmailsButton;
