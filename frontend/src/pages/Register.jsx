import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'

const Register = () => {
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.password) {
      setMessage('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/register', formData);
      setMessage('Регистрация успешна: ' + response.data.name);
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Неизвестная ошибка';
      setMessage('Ошибка регистрации: ' + errorMessage);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className='div-v'>
      <div className='div-main'>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Имя" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Пароль" onChange={handleChange} />
          <button type="submit">Зарегистрироваться</button>
        </form>
        <button className="btn-reg" onClick={handleLoginRedirect}>Войти</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
