import express, { Router } from 'express';
import { PoolClient } from 'pg';
import pool from '../app/db';
import User from '../libraries/classUsers';
import Common from '../libraries/classCommon';
import { clientClose, setUserInfo, replaceSchema } from '../app/helpers';

const router: Router = express.Router();

router.post('/register', (req, res) => {
  const { email } = req.body;
  const postData = req.body;

  (async () => {
    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      const existingUser = await Common.findOne(
        client,
        '$$SCHEMANAME$$.users',
        'email',
        email
      );

      if (!existingUser) {
        // If email is unique and password was provided, create account
        const userdata = await User.saveUser(client, postData);
        const lastId = userdata.id;
        const returnUserData = await Common.findById(
          client,
          '$$SCHEMANAME$$.users',
          lastId
        );
        // console.log(existingUser);
        const userInfo = setUserInfo(returnUserData);
        if (returnUserData !== null) {
          res.status(200).json({
            user: userInfo
          });
        } else {
          res.status(404).send('user not exits');
        }
      } else {
        res
          .status(422)
          .send({ error: 'That email address is already in use.' });
      }
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).send();
      clientClose(client);
    }
  })();
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  (async () => {
    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      const sqlStatement =
        'select * from $$SCHEMANAME$$.users where email=$1 AND password=$2';
      const dbresult = await client.query(replaceSchema(sqlStatement), [
        email,
        password
      ]);
      if (dbresult.rowCount) {
        const [result] = dbresult.rows;
        const userInfo = setUserInfo(result);
        if (userInfo !== null) {
          res.status(200).json({
            user: userInfo,
            message: 'User successfully logged in'
          });
        } else {
          res.status(404).send('user not exits');
        }
      } else {
        res
          .status(422)
          .send({ error: 'That email address is already in use.' });
      }
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).send();
      clientClose(client);
    }
  })();
});

export default router;
