import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import { PageRoutes } from '@doer/entities';
import db from '../DataBase/DataBase';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

class MailService {
  async sendEmailConfirmation(email) {
    const id = randomstring.generate(8);

    return db.none(
      `INSERT INTO confirmation_email (id, email) VALUES ($1, $2)`,
      [id, email]
    )
    .then(() => {
      const mailOptions = {
        to: email,
        subject: 'Please confirm your email',
        html: `<div>
          <h1>You've just registered on <a href="https://doer.com">doer.com</a>. Please follow the link to </h1>
          <a href="${process.env.BASE_URL}${PageRoutes.Auth}${PageRoutes.RestorePassword}/${id}" target="_blank">confirm your email</a>
        </div>`,
      };
      
      transporter.sendMail(mailOptions);
    });
  }

  async sendPasswordRestoring(email) {
    const id = randomstring.generate(8);

    return db.none(
      `INSERT INTO restoring_password (id, email) VALUES ($1, $2)`,
      [id, email]
    )
    .then(() => {
      const mailOptions = {
        to: email,
        subject: 'Restore password',
        html: `<div>
          <h1>You've just requested password restoring for <a href="https://doer.com">doer.com</a>. Please follow the link to </h1>
          <a href="${process.env.BASE_URL}${PageRoutes.Auth}${PageRoutes.ResetPassword}/${id}" target="_blank">set new password</a>
        </div>`,
      };
      
      transporter.sendMail(mailOptions);
    });
  }
}

export default new MailService();