import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SendEmailForm = () => {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors([]);

    const recipientList = recipients.split(',').map((email) => email.trim());

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/api/emails/send',
        { recipients: recipientList, subject, body },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setMessage(response.data.message);
      setRecipients('');
      setSubject('');
      setBody('');
      await wait(1000);
      navigate('/mail');
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setMessage('Не удалось отправить письмо.');
      }
    }
  };


  const handleMailRedirect = () => {
    navigate('/mail');
  };

  return (
    <div style={formContainerStyles}>
      <h2>Новое сообщение</h2>
      {message && <p style={messageStyles}>{message}</p>}
      {errors.length > 0 && (
        <ul style={errorListStyles}>
          {errors.map((err, index) => (
            <li key={index} style={errorItemStyles}>
              {err.msg}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} style={formStyles}>
        <label style={labelStyles}>
          Кому (через запятую):
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            style={inputStyles}
            placeholder="example1@mail.com, example2@mail.com"
          />
        </label>
        <label style={labelStyles}>
          Тема:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={inputStyles}
            placeholder="Введите тему письма"
          />
        </label>
        <label style={labelStyles}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={textareaStyles}
            placeholder="Введите текст письма"
          ></textarea>
        </label>
        <button type="submit" style={buttonStyles}>
          Отправить
        </button>
      </form>
      <button style={buttonStyles} onClick={handleMailRedirect}>Назад</button>
    </div>
  );
};

const formContainerStyles = {
  maxWidth: '500px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const labelStyles = {
  fontWeight: 'bold',
  marginBottom: '5px',
};

const inputStyles = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '16px',
  width: '100%',
};

const textareaStyles = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '16px',
  width: '100%',
  minHeight: '100px',
};

const buttonStyles = {
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: '#fff',
  fontSize: '16px',
  cursor: 'pointer',
  marginBottom: '10px',
};

const messageStyles = {
  color: 'green',
  fontWeight: 'bold',
  marginBottom: '15px',
};

const errorListStyles = {
  color: 'red',
  listStyle: 'none',
  padding: 0,
  marginBottom: '15px',
};

const errorItemStyles = {
  fontSize: '14px',
};

export default SendEmailForm;
