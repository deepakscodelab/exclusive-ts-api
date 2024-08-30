import sha1 from 'sha1';
import xml2js from 'xml2js';
import path from 'path';
import fs from 'fs';
import { PoolClient } from 'pg';
import pool from '../app/db';
import { replaceSchema } from '../app/helpers';

const parser = new xml2js.Parser();

let client = null;
let sqlstatement;

// interface JsonConfig {
//   configuration: {
//     PROCversions: {
//       version: Array<{
//         $: {
//           Id: string;
//           file?: string;
//         };
//         statement?: Array<string>;
//       }>;
//     }[];
//   };
// }

async function createSCHEMA() {
  client = await pool.connect();
  sqlstatement =
    'CREATE SCHEMA IF NOT EXISTS $$SCHEMANAME$$; SET search_path TO $$SCHEMANAME$$';
  const dbresult = await client.query(replaceSchema(sqlstatement));
  if (dbresult) {
    return true;
  }
  return false;
}

async function executeDDLVersion(json: any): Promise<number> {
  const client = await pool.connect();
  console.log('Start ddl migration');
  let lastExecuteddDDL: string = '0';
  let sqlstatement: string;
  let dbresult: any;

  sqlstatement =
    "select * from pg_tables where schemaname=$1 and tablename='ddl_version'";
  dbresult = await client.query(sqlstatement, ['dev']);

  if (dbresult.rowCount === 0) {
    sqlstatement =
      'CREATE TABLE $$SCHEMANAME$$.ddl_version (version integer NOT NULL , datecreated timestamp without time zone DEFAULT now())';
    dbresult = await client.query(replaceSchema(sqlstatement));
  } else {
    sqlstatement =
      'SELECT COALESCE(MAX(version),0) AS version FROM $$SCHEMANAME$$.ddl_version';
    dbresult = await client.query(replaceSchema(sqlstatement));
    lastExecuteddDDL = dbresult.rows[0].version;
  }

  for (
    let i: number = 0;
    i < json.configuration.DDLversions[0].version.length;
    i += 1
  ) {
    const sqlno: string = json.configuration.DDLversions[0].version[i].$.Id;
    sqlstatement = json.configuration.DDLversions[0].version[i].statement[0];
    sqlstatement = replaceSchema(sqlstatement);

    try {
      if (sqlno > lastExecuteddDDL) {
        console.log(`New DDL version.. executing..NO: ${sqlno}`);
        dbresult = await client.query(sqlstatement);
        sqlstatement =
          'INSERT INTO $$SCHEMANAME$$.ddl_version (version) VALUES($1)';
        dbresult = await client.query(replaceSchema(sqlstatement), [sqlno]);
      }
    } catch (error) {
      console.log(error);
      return -1;
    }
  }
  return 0;
}

async function executeProcVersion(json: any): Promise<number> {
  const client: PoolClient = await pool.connect();
  console.log('Start proc migration');

  for (
    let i: number = 0;
    i < json.configuration.PROCversions[0].version.length;
    i += 1
  ) {
    const sqlid: string = json.configuration.PROCversions[0].version[i].$.Id;
    const { file } = json.configuration.PROCversions[0].version[i].$;
    let sqlstatement: string;

    if (file !== undefined) {
      sqlstatement = fs.readFileSync(
        path.resolve(__dirname, `SQL/${file}`),
        'utf8'
      );
    } else {
      sqlstatement = json.configuration.PROCversions[0].version[i].statement[0];
    }

    try {
      sqlstatement = replaceSchema(sqlstatement);
      const newHash: string = sha1(sqlstatement);
      let lastHash: string = '00000000';

      const dbresult: any = await client.query(
        replaceSchema(
          'SELECT hash from $$SCHEMANAME$$.proc_version where sqlid=$1'
        ),
        [sqlid] as string[] | string[]
      );

      if (dbresult.rowCount === 1) {
        lastHash = dbresult.rows[0].hash;
      }

      if (newHash !== lastHash) {
        await client.query(sqlstatement);
        if (lastHash === '00000000') {
          console.log(`Executing new sp trigger id:${sqlid}`);
          sqlstatement =
            'INSERT INTO $$SCHEMANAME$$.proc_version (sqlid,hash) VALUES($1,$2)';
          await client.query(replaceSchema(sqlstatement), [sqlid, newHash]);
        } else {
          console.log(`UPDATE procedure trigger id: ${sqlid}`);
          sqlstatement =
            'UPDATE $$SCHEMANAME$$.proc_version SET hash= $2, dateupdates=now() where sqlid=$1';
          await client.query(replaceSchema(sqlstatement), [sqlid, newHash]);
        }
      }
    } catch (error2) {
      console.log(error2);
      return -1;
    }
  }

  client.release();
  console.log('end db migration');
  return 0;
}
async function executeRelease(json: any): Promise<number> {
  let code;
  // Create database schema if not exist
  await createSCHEMA();
  // DDL
  code = await executeDDLVersion(json);
  if (code) {
    return code;
  }
  // Proc
  code = await executeProcVersion(json);
  if (code) {
    return code;
  }
  return 0;
}

function loadXMLDoc(filePath: string): undefined {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    parser.parseString(fileData, (err, result) => {
      if (err) {
        console.log(err.message);
        process.exitCode = -1;
        process.exit(process.exitCode);
      } else {
        // code here
        executeRelease(result)
          .then((excode) => {
            console.log(`Exit code: ${excode}`);
            process.exitCode = excode;
            process.exit(process.exitCode);
          })
          .catch((err1) => {
            console.log(err1);
            process.exitCode = -1;
            process.exit(process.exitCode);
          });
      }
    });
  } catch (error) {
    console.log(error);
    process.exitCode = -1;
    process.exit(process.exitCode);
  }
}

try {
  const XMLPath: string = path.resolve(__dirname, 'DBConfiguration.xml');
  process.exitCode = loadXMLDoc(XMLPath);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log(err.message);
  }
  process.exitCode = -1;
}
