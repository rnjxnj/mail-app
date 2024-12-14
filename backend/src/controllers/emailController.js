import Email from '../models/Email.js';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import User from '../models/User.js'
import { fetchUnreadMails } from '../utils/imapHandler.js';
import { validationResult } from 'express-validator';
const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',

});

export const sendEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { recipients, subject, body } = req.body;

  try {
    if (!req.userId) {
        return res.status(401).json({ message: 'Пользователь не авторизован.' });
    }
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: user.name + "<" + user.email + ">",
      to: recipients,
      subject,
      text: body,
    }).then(msg => console.log(msg));
    const email = new Email({
      sender: user.email,
      recipient: recipients,
      subject,
      body,
      direction: 'outgoing',
    });
    await email.save();

    res.status(200).json({ message: 'Письмо отправлено!'});
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    res.status(500).json({ message: 'Не удалось отправить письмо.', error });
  }
};

export const fetchEmails = async (req, res) => {
  try {
    console.log('Запуск функции fetchUnreadMails...');
    fetchUnreadMails();
    return res.status(200).json({ message: 'Fetch email process started' });
  } catch (error) {
    console.error('Ошибка при запуске fetchUnreadMails:', error);
    return res.status(500).json({ message: 'Ошибка запуска fetchUnreadMails', error });
  }
};

export const getInboxEmails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    const userEmail = user.email;

    // Находим все входящие письма, где recipient совпадает с email пользователя
    const emails = await Email.find({ recipient: userEmail, direction: 'incoming' });

    if (!emails || emails.length === 0) {
      return res.status(404).json({ message: 'Входящих писем не найдено.' });
    }

    res.status(200).json(emails);
  } catch (error) {
    console.error('Ошибка при получении входящих писем:', error);
    res.status(500).json({ message: 'Не удалось получить письма.' });
  }
};

export const getSentEmails = async (req, res) => {
  try {
    const userId = req.userId; // Получаем ID пользователя из middleware checkAuth
    const user = await User.findById(userId); // Находим пользователя в базе данных

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    const userEmail = user.email; // Получаем email пользователя

    // Находим все исходящие письма, где sender совпадает с email пользователя
    const emails = await Email.find({ sender: userEmail, direction: 'outgoing' });

    if (!emails || emails.length === 0) {
      return res.status(404).json({ message: 'Исходящих писем не найдено.' });
    }

    res.status(200).json(emails); // Возвращаем список писем
  } catch (error) {
    console.error('Ошибка при получении исходящих писем:', error);
    res.status(500).json({ message: 'Не удалось получить письма.' });
  }
};

export const markEmailAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Находим письмо и обновляем его статус
    const email = await Email.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true } // Возвращаем обновлённый документ
    );

    if (!email) {
      return res.status(404).json({ message: 'Письмо не найдено.' });
    }

    res.status(200).json({ message: 'Письмо помечено как прочитанное.', email });
  } catch (error) {
    console.error('Ошибка при обновлении статуса письма:', error);
    res.status(500).json({ message: 'Не удалось обновить статус письма.' });
  }
};
