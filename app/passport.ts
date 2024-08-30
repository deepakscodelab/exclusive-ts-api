import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import pool from '../app/db';

import user from '../libraries/classUsers';
import Common from '../libraries/classCommon';
import { constants } from '../config/constants';

import { clientClose } from './helpers';

// Setting username field to email rather than username
const localOptions = {
  usernameField: 'email'
};

// Setting up local login strategy
// const localLogin: LocalStrategy = new LocalStrategy(
//   localOptions,
//   async (
//     email: string,
//     password: string,
//     done: (error: any, user?: any, info?: any) => void
//   ) => {
//     let client: any = null;
//     const userid: number = 1;
//     try {
//       client = await pool.connect();
//       const userData: any = await Common.findOne(
//         client,
//         '$$SCHEMANAME$$.users',
//         'email',
//         email
//       );
//       if (!userData) {
//         return done(null, false, {
//           error: 'Your login details could not be verified. Please try again.'
//         });
//       }
//       const isMatch: boolean = await user.comparePassword(
//         password,
//         userData.password
//       );
//       if (!isMatch) {
//         return done(null, false, {
//           error: 'Your login details could not be verified. Please try again.'
//         });
//       }
//       client.release();
//       return done(null, userData);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send();
//       clientClose(client);
//     }
//   }
// );

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  // Telling Passport where to find the secret
  secretOrKey: constants.SECRET

  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
// const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
//   (async () => {
//     let client = null;
//     const userid = 1;
//     try {
//       client = await pool.connect();
//       const userData = await Common.findById(
//         client,
//         '$$SCHEMANAME$$.users',
//         userid
//       );
//       if (userData !== null) {
//         res.status(200).send({
//           token: 'JWT',
//           userData
//         });
//       } else {
//         res.status(404).send('user not exits');
//       }
//       client.release();
//     } catch (error) {
//       console.log(error);
//       res.status(500).send();
//       clientClose(client);
//     }
//   })();
// });

// passport.use(jwtLogin);
// passport.use(localLogin);
