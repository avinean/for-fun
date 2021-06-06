
import { routerHelper, User, Params } from '@doer/entities';
import authService from '../Services/AuthService';
import secret from '../Services/AuthService';
import mailService from '../Services/MailService';
import BaseAPI from './BaseAPI';

export default class PublicAPI extends BaseAPI {
  initRoutes() {
    this.router.post(routerHelper.signIn().path(), async (req, res) => {
      secret.check(req.body)
      .then(token => {
        res.status(200).send({ token });
      })
      .catch(err => {
        res.status(err.status).send(err);
      });
    });

    this.router.post(routerHelper.signUp().path(), async (req, res) => {
      const hash = secret.hash(req.body);
      const { email, nickname } = req.body;

      this.db.none(`
        INSERT INTO users
        (email, nickname, hash)
        VALUES ($1, $2, $3)
      `, [ email, nickname, hash ])
        .then(async () => {
          await mailService.sendEmailConfirmation(email);
          res.sendStatus(200);
        })
        .catch(err => {
          console.log(err);
          res.status(400).send({
            error: 'Email is already in use',
          });
        });
    });

    this.router.get(routerHelper.confirmEmail().param(Params.Hash).path(), async (req, res) => {
      console.log(req.params.hash);
      this.db.one(`
        UPDATE users
        SET confirmed=true, confirmation_at=CURRENT_TIMESTAMP
        WHERE email=(
          SELECT email
          FROM confirmation_email
          WHERE
            EXTRACT(DAY FROM (CURRENT_TIMESTAMP - created_at)) < 1
            AND id=$1
          LIMIT 1
        )
        RETURNING id;
      `, req.params.hash)
        .then(() => {
          this.db.none(`
            DELETE FROM confirmation_email
            WHERE id=$1;
          `, req.params.hash);
          res.sendStatus(200);
        })
        .catch(err => {
          console.log(err);
          res.status(400).send({
            error: 'Link isn\'t valid',
          });
        });
    });

    this.router.post(routerHelper.confirmEmail().path(), async (req, res) => {
      const { email } = req.body;

      try {
        const user = await this.db.one(`
          SELECT confirmed
          FROM users
          WHERE email = $1
        `, [email])
        if (user.confirmed) {
          return res.status(400).send({
            error: `User has already been confirmed. Try to <a href="${routerHelper.auth().restorePassword().path()}">restore password</a>`,
          });
        }
      } catch(e) {
        return res.status(400).send({
          error: 'User with such email was not found.',
        });
      }

      try {
        const isExist = await this.db.one(`
          SELECT id
          FROM confirmation_email
          WHERE email = $1 AND EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - created_at)) < 1
        `, [email]);
        if (isExist) {
          return res.status(400).send({
            error: 'You can not resend confirmation link more once an hour.',
          });
        }
      } catch {}

      mailService.sendEmailConfirmation(email)
        .then(() => {
          res.sendStatus(200);
        })
        .catch(err => {
          res.status(400).send({
            error: 'Server error. Please try again later.',
          });
        });

    });

    this.router.post(routerHelper.restorePassword().path(), async (req, res) => {
      const { email } = req.body;

      try {
        await this.db.one(`
          SELECT confirmed
          FROM users
          WHERE email = $1
        `, [email]);
      } catch(e) {
        return res.status(400).send({
          error: 'User with such email was not found.',
        });
      }

      try {
        const isExist = await this.db.one(`
          SELECT id
          FROM restoring_password
          WHERE email = $1 AND EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - created_at)) < 1
        `, [email]);
        if (isExist) {
          return res.status(400).send({
            error: 'You can not request restoring password more once an hour.',
          });
        }
      } catch {}

      mailService.sendPasswordRestoring(email)
        .then(() => {
          res.sendStatus(200);
        })
        .catch(err => {
          res.status(400).send({
            error: 'Server error. Please try again later.',
          });
        });

    });

    this.router.post(routerHelper.resetPassword().path(), async (req, res) => {
      const { pass, hash } = req.body;
      let id, email;

      try {
        ({id, email} = await this.db.one(`
          SELECT id, email
          FROM users
          WHERE email = (
            SELECT email
            FROM restoring_password
            WHERE id = $1
          )
        `, [hash]));
      } catch(e) {
        return res.status(400).send({
          error: 'User with such email was not found.',
        });
      }

      this.db.none(`
        UPDATE users
        SET hash=$1, updated_at=$2
        WHERE email=$3;
        DELETE FROM restoring_password
        WHERE email=$3;
      `, [
        authService.hash({ pass, email }),
        new Date().toISOString(),
        email
      ])
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.status(400).send({
            error: 'You can not request restoring password more once an hour.',
          });
        })

    });

  }
}

