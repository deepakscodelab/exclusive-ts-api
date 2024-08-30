import { Pool, types } from 'pg';
import url from 'url';

// const config = require('config');
// Configure database connection either from environment (on Heroku side) or local configuration
// const connection = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
// const connection = 'postgres://postgres:123456@localhost:5432/savontiles';
const connection: string =
  process.env.DATABASE_URL ||
  'postgres://postgres:123456@localhost:5432/exclusive';

types.setTypeParser(1700, (val: string): number => +val);

const params = url.parse(connection);
const auth: string[] = params.auth!.split(':');

const dbconfig: {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  ssl: {
    rejectUnauthorized: boolean;
  };
  max: number;
  min: number;
} = {
  user: auth[0],
  password: auth[1],
  host: params.hostname!,
  port: parseInt(params.port!),
  database: params.pathname!.split('/')[1],
  ssl: {
    rejectUnauthorized: false
  },
  max: 30,
  min: 2
};

const pool: Pool = new Pool(dbconfig);

pool.on('error', (error, client) => {
  console.log(`ERROR pool connection :${error}`);
});

export default pool;
