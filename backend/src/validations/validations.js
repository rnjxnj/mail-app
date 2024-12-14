import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('name', 'Укажите имя').isLength({ min: 2 }),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const EmailRequestValidation = [
  body('recipients')
    .custom((value) => {
      if (!Array.isArray(value)) {
        // Проверяем, что это массив
        throw new Error('Поле "recipients" должно быть массивом.');
      }
      if (value.length === 0) {
        // Проверяем, что массив не пустой
        throw new Error('Поле "recipients" не должно быть пустым.');
      }
      // Проверяем, что все элементы в массиве — корректные email
      if (value.some((email) => typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email))) {
        throw new Error('Каждый элемент массива "recipients" должен быть корректным email.');
      }
      return true;
    }),
  body('subject', 'Тема письма обязательна.').notEmpty(),
  body('body', 'Тело письма обязательно.').notEmpty(),
];
