"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
