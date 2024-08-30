"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../app/db"));
const classUsers_1 = __importDefault(require("../libraries/classUsers"));
const classCommon_1 = __importDefault(require("../libraries/classCommon"));
const helpers_1 = require("../app/helpers");
const router = express_1.default.Router();
router.post('/register', (req, res) => {
    const { email } = req.body;
    const postData = req.body;
    (async () => {
        let client = null;
        try {
            client = await db_1.default.connect();
            const existingUser = await classCommon_1.default.findOne(client, '$$SCHEMANAME$$.users', 'email', email);
            if (!existingUser) {
                // If email is unique and password was provided, create account
                const userdata = await classUsers_1.default.saveUser(client, postData);
                const lastId = userdata.id;
                const returnUserData = await classCommon_1.default.findById(client, '$$SCHEMANAME$$.users', lastId);
                // console.log(existingUser);
                const userInfo = (0, helpers_1.setUserInfo)(returnUserData);
                if (returnUserData !== null) {
                    res.status(200).json({
                        user: userInfo
                    });
                }
                else {
                    res.status(404).send('user not exits');
                }
            }
            else {
                res
                    .status(422)
                    .send({ error: 'That email address is already in use.' });
            }
            client.release();
        }
        catch (error) {
            console.log(error);
            res.status(500).send();
            (0, helpers_1.clientClose)(client);
        }
    })();
});
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    (async () => {
        let client = null;
        try {
            client = await db_1.default.connect();
            const sqlStatement = 'select * from $$SCHEMANAME$$.users where email=$1 AND password=$2';
            const dbresult = await client.query((0, helpers_1.replaceSchema)(sqlStatement), [
                email,
                password
            ]);
            if (dbresult.rowCount) {
                const [result] = dbresult.rows;
                const userInfo = (0, helpers_1.setUserInfo)(result);
                if (userInfo !== null) {
                    res.status(200).json({
                        user: userInfo,
                        message: 'User successfully logged in'
                    });
                }
                else {
                    res.status(404).send('user not exits');
                }
            }
            else {
                res
                    .status(422)
                    .send({ error: 'That email address is already in use.' });
            }
            client.release();
        }
        catch (error) {
            console.log(error);
            res.status(500).send();
            (0, helpers_1.clientClose)(client);
        }
    })();
});
exports.default = router;
