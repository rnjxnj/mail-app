import Imap from 'imap';
import { simpleParser } from 'mailparser';
import Email from '../models/Email.js';
import connectToDB from "../../db/connection.js";

connectToDB();

export function fetchUnreadMails() {

    const imap = new Imap({
      user: 'lemon.rksp.coursework@gmail.com',
      password: process.env.PASSWORD_APP,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    imap.once('ready', function () {
      imap.openBox('INBOX', false, function (err, box) {
        if (err) throw err;
  
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: '', markSeen: true };
  
        imap.search(searchCriteria, function (err, results) {
          if (err) throw err;
  
          if (!results || results.length === 0) {
            console.log('No new emails');
            imap.end();
            return;
          }
  
          const mailStream = imap.fetch(results, fetchOptions);
  
          mailStream.on('message', function (message) {
            message.on('body', function (stream, info) {
              simpleParser(stream, async (err, mail) => {
                if (err) {
                  console.error('Error parsing email:', err);
                  return;
                }
  
                try {
                  const emailData = {
                    sender: mail.from ? mail.from.value.map((addr) => addr.address).join(', ') : '',
                    recipient: mail.to ? mail.to.value.map((addr) => addr.address) : [],
                    subject: mail.subject || '(No Subject)',
                    body: mail.text || '',
                    attachment: [],
                    dateSent: mail.date || new Date(),
                    direction: 'incoming',
                  };
  
                  const email = new Email(emailData);
                  await email.save();
                  console.log('Email saved:', email.subject);
                } catch (saveErr) {
                  console.error('Error saving email:', saveErr);
                }
              });
            });
          });
  
          mailStream.once('end', function () {
            console.log('Finished fetching all emails');
            imap.end();
          });
        });
      });
    });
  
    imap.once('error', function (err) {
      console.error('IMAP error:', err);
    });
  
    imap.once('end', function () {
      console.log('IMAP connection ended');
    });
  
    imap.connect();
}