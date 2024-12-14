import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMail = () => {
    navigate('/mail');
  };


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Вы не авторизованы.');
        return;
      }

      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + '/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
      } catch (err) {
        setMessage('Ошибка получения профиля: ' + (err.response?.data?.message || 'Неизвестная ошибка'));
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Профиль</h2>
      {message && <p>{message}</p>}
      {profileData ? (
        <div>
          <p>Имя: {profileData.name}</p>
          <p>Email: {profileData.email}</p>
          <p>Роль: {profileData.role}</p>
          <p>{apiUrl}</p>
          <button onClick={handleLogout}>Выйти</button>
          <button style={btn} onClick={handleMail}>Назад</button>
        </div>
      ) : (
        <p>Загрузка данных профиля...</p>
      )}
    </div>
  );
};

const btn = {
  marginLeft: '10px',
};

export default Profile;
