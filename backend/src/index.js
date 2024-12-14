import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: "../.env"});

import connectToDB from "../db/connection.js";
import { registerValidation } from "./validations/validations.js";
import { EmailRequestValidation } from './validations/validations.js'
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import { 
  sendEmail,
  fetchEmails, 
  getInboxEmails, 
  getSentEmails, 
  markEmailAsRead 
} from './controllers/emailController.js';

connectToDB();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/auth/register', registerValidation, register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', checkAuth, getMe);

app.post('/api/emails/send', EmailRequestValidation, checkAuth, sendEmail);
app.get('/api/emails/fetch', checkAuth, fetchEmails);
app.get('/api/emails/inbox', checkAuth, getInboxEmails);
app.get('/api/emails/sent', checkAuth, getSentEmails);
app.patch('/api/emails/:id/read', checkAuth, markEmailAsRead);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'))
  );
}

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
