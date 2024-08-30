"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const url_1 = __importDefault(require("url"));
// const config = require('config');
// Configure database connection either from environment (on Heroku side) or local configuration
// const connection = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
// const connection = 'postgres://postgres:123456@localhost:5432/savontiles';
const connection = process.env.DATABASE_URL ||
    'postgres://postgres:123456@localhost:5432/exclusive';
pg_1.types.setTypeParser(1700, (val) => +val);
const params = url_1.default.parse(connection);
const auth = params.auth.split(':');
const dbconfig = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: parseInt(params.port),
    database: params.pathname.split('/')[1],
    ssl: {
        rejectUnauthorized: false
    },
    max: 30,
    min: 2
};
const pool = new pg_1.Pool(dbconfig);
pool.on('error', (error, client) => {
    console.log(`ERROR pool connection :${error}`);
});
exports.default = pool;
