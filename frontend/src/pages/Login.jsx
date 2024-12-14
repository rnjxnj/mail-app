import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/mail');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Неизвестная ошибка';
      setMessage('Ошибка входа: ' + errorMessage);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className='div-v'>
      <div className='div-main'>
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            onChange={handleChange}
          />
          <button type="submit">Войти</button>
        </form>
        <button className="btn-reg" onClick={handleRegisterRedirect}>Зарегистрироваться</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
