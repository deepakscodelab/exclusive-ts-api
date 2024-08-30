import express, { Request, Response, Router } from 'express';

import pool from '../app/db';
import { clientClose } from '../app/helpers';
import Common from '../libraries/classCommon';

const router: Router = express.Router();

// router.post(
//   '/userProfile',
//   async (req: Request, res: Response): Promise<void> => {
//     let client: any = null;
//     const table: string = '$$SCHEMANAME$$.users';
//     const { userId }: { userId: string } = req.params;

//     if (req.user.id.toString() !== userId) {
//       res
//         .status(401)
//         .json({ error: 'You are not authorized to view this user profile.' });
//       return;
//     }

//     try {
//       client = await pool.connect();
//       const user: any = await Common.findById(client, table, userId);

//       if (user !== null) {
//         res.status(200).send({
//           token: 'JWT',
//           user
//         });
//       } else {
//         res.status(404).send('user not exists');
//       }
//       client.release();
//     } catch (error) {
//       res.status(500).send();
//       clientClose(client);
//     }
//   }
// );

export default router;
