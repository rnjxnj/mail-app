import jwt from 'jsonwebtoken';
import bcrypts from 'bcryptjs';

import { validationResult } from 'express-validator';
import User from '../models/User.js'

export const register = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
  
      const salt = await bcrypts.genSalt(10);
      const passwordHash = await bcrypts.hash(req.body.password, salt);
  
      const doc = new User({
        email: req.body.email,
        name: req.body.name,
        password: passwordHash,
      });
  
      const user = await doc.save();
  
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '90d' }
      );
    
      const {password, ...userData } = user._doc
      res.json({
        ...userData,
        token,
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось зарегистрироваться :(",
      });
    }
};

export const login = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          message: 'Неверный логин или пароль.'
        });
      }
  
      const isValidPass = await bcrypts.compare(req.body.password, user._doc.password);
      if (!isValidPass) {
        return res.status(400).json({
          message: 'Неверный логин или пароль.'
        });
      }
  
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '90d',
        }
      );
      // console.log(token);
  
      const {password, ...userData } = user._doc
      res.json({
        ...userData,
        token,
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось авторизоваться :(",
      });
    }
};

export const getMe = async (req, res) => {
    try {
  
      const user = await User.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
  
      const {password, ...userData } = user._doc
      res.json({
        ...userData
      });
      
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Нет доступа",
      });
    }
};
