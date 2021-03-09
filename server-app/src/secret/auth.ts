import crypto from 'crypto';
import db from "../DataBase/DataBase";
import { AuthRequest, User } from '@doer/entities';

const key = "abcdefghijklsnopqrstuvwx";

export default {
  check: async ({ email, pass }: AuthRequest): Promise<string|void> => {
    const secret = `${email}:${pass}`;

    const encrypt = crypto.createCipheriv('des-ede3', key, "");
    let userToken = encrypt.update(secret, 'utf8', 'base64');
    userToken += encrypt.final('base64');
      
    return db.one<User>(`SELECT * FROM users WHERE hash = $1`, userToken)
      .then(async ({ id, email, nickname }: User) => {

        const secret = `${id}|${email}|${nickname}|the most secret base ever`;
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
        throw({ status: 400, message: 'User not exist'});
      });
  }
}

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