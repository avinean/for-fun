import crypto from 'crypto';
import db from "../DataBase/DataBase";
import { AuthRequest, RegistrationRequest, User } from '@doer/entities';

const key = "abcdefghijklsnopqrstuvwx";

const hash = ({ email, pass }: Partial<RegistrationRequest>): string => {
  const secret = `${email}:${pass}`;
  const encrypt = crypto.createCipheriv('des-ede3', key, "");
  let userToken = encrypt.update(secret, 'utf8', 'base64');
  userToken += encrypt.final('base64');

  return userToken;
}

const check = async ({ email, pass }: AuthRequest): Promise<string|void> => {    
  const token = hash({ email, pass });

  return db.one<User>(`SELECT * FROM users WHERE hash = $1`, token)
    .then(async ({ id, email, nickname }: User) => {

      const secret = `${id}|${email}|${nickname}|${new Date().toISOString()}|the most secret base ever`;
      const encrypt = crypto.createCipheriv('des-ede3', key, "");
      let sessionToken = encrypt.update(secret, 'utf8', 'base64');
      sessionToken += encrypt.final('base64');
      
      await db.none(`
        UPDATE users 
        SET 
        token = $1,
        last_authorization = $2
        where id = $3
      `, [ sessionToken, new Date().toISOString(), id ]);
      
      return sessionToken;
    })
    .catch(err => {
      throw({ status: 400, error: 'Email or password is incorrect'});
    });
};

const confirm = (token: string) => {      
  return db.one<User>(`SELECT id, email, nickname, name, last_name, age, photo, last_authorization FROM users WHERE token = $1`, token)
    .then(async (user: User) => {
      const sessionDate: any = new Date(user.lastAuthorization);
      const currentDate: any = new Date();

      const maxSessionDuration = 24;
      const sessionDuration = Math.floor((currentDate - sessionDate) / 36e5);
      const authentificated = sessionDuration < maxSessionDuration;

      if (authentificated) {
        return user;
      } else {
        throw({ status: 403, error: 'Authorization is required'});
      }
    })
    .catch(err => {
      throw({ status: 403, error: 'Authorization is required'});
    });
};

export default {
  hash,
  check,
  confirm,
};

// const ccrypto = require("crypto");

// var key = "abcdefghijklsnopqrstuvwx";
// var pt = "avinean@gmail.com:Coba1953Vlad2832";

// var encrypt = ccrypto.createCipheriv('des-ede3', key, "");
// var theCipher = encrypt.update(pt, 'utf8', 'base64');
// theCipher += encrypt.final('base64');
// console.log(theCipher)

// var decrypt = ccrypto.createDecipheriv('des-ede3', key, "");
// var s = decrypt.update(theCipher, 'base64', 'utf8');
// console.log(s + decrypt.final('utf8'));