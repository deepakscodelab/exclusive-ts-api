"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha1_1 = __importDefault(require("sha1"));
const xml2js_1 = __importDefault(require("xml2js"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = __importDefault(require("../app/db"));
const helpers_1 = require("../app/helpers");
const parser = new xml2js_1.default.Parser();
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
    client = await db_1.default.connect();
    sqlstatement =
        'CREATE SCHEMA IF NOT EXISTS $$SCHEMANAME$$; SET search_path TO $$SCHEMANAME$$';
    const dbresult = await client.query((0, helpers_1.replaceSchema)(sqlstatement));
    if (dbresult) {
        return true;
    }
    return false;
}
async function executeDDLVersion(json) {
    const client = await db_1.default.connect();
    console.log('Start ddl migration');
    let lastExecuteddDDL = '0';
    let sqlstatement;
    let dbresult;
    sqlstatement =
        "select * from pg_tables where schemaname=$1 and tablename='ddl_version'";
    dbresult = await client.query(sqlstatement, ['dev']);
    if (dbresult.rowCount === 0) {
        sqlstatement =
            'CREATE TABLE $$SCHEMANAME$$.ddl_version (version integer NOT NULL , datecreated timestamp without time zone DEFAULT now())';
        dbresult = await client.query((0, helpers_1.replaceSchema)(sqlstatement));
    }
    else {
        sqlstatement =
            'SELECT COALESCE(MAX(version),0) AS version FROM $$SCHEMANAME$$.ddl_version';
        dbresult = await client.query((0, helpers_1.replaceSchema)(sqlstatement));
        lastExecuteddDDL = dbresult.rows[0].version;
    }
    for (let i = 0; i < json.configuration.DDLversions[0].version.length; i += 1) {
        const sqlno = json.configuration.DDLversions[0].version[i].$.Id;
        sqlstatement = json.configuration.DDLversions[0].version[i].statement[0];
        sqlstatement = (0, helpers_1.replaceSchema)(sqlstatement);
        try {
            if (sqlno > lastExecuteddDDL) {
                console.log(`New DDL version.. executing..NO: ${sqlno}`);
                dbresult = await client.query(sqlstatement);
                sqlstatement =
                    'INSERT INTO $$SCHEMANAME$$.ddl_version (version) VALUES($1)';
                dbresult = await client.query((0, helpers_1.replaceSchema)(sqlstatement), [sqlno]);
            }
        }
        catch (error) {
            console.log(error);
            return -1;
        }
    }
    return 0;
}
async function executeProcVersion(json) {
    const client = await db_1.default.connect();
    console.log('Start proc migration');
    for (let i = 0; i < json.configuration.PROCversions[0].version.length; i += 1) {
        const sqlid = json.configuration.PROCversions[0].version[i].$.Id;
        const { file } = json.configuration.PROCversions[0].version[i].$;
        let sqlstatement;
        if (file !== undefined) {
            sqlstatement = fs_1.default.readFileSync(path_1.default.resolve(__dirname, `SQL/${file}`), 'utf8');
        }
        else {
            sqlstatement = json.configuration.PROCversions[0].version[i].statement[0];
        }
        try {
            sqlstatement = (0, helpers_1.replaceSchema)(sqlstatement);
            const newHash = (0, sha1_1.default)(sqlstatement);
            let lastHash = '00000000';
            const dbresult = await client.query((0, helpers_1.replaceSchema)('SELECT hash from $$SCHEMANAME$$.proc_version where sqlid=$1'), [sqlid]);
            if (dbresult.rowCount === 1) {
                lastHash = dbresult.rows[0].hash;
            }
            if (newHash !== lastHash) {
                await client.query(sqlstatement);
                if (lastHash === '00000000') {
                    console.log(`Executing new sp trigger id:${sqlid}`);
                    sqlstatement =
                        'INSERT INTO $$SCHEMANAME$$.proc_version (sqlid,hash) VALUES($1,$2)';
                    await client.query((0, helpers_1.replaceSchema)(sqlstatement), [sqlid, newHash]);
                }
                else {
                    console.log(`UPDATE procedure trigger id: ${sqlid}`);
                    sqlstatement =
                        'UPDATE $$SCHEMANAME$$.proc_version SET hash= $2, dateupdates=now() where sqlid=$1';
                    await client.query((0, helpers_1.replaceSchema)(sqlstatement), [sqlid, newHash]);
                }
            }
        }
        catch (error2) {
            console.log(error2);
            return -1;
        }
    }
    client.release();
    console.log('end db migration');
    return 0;
}
async function executeRelease(json) {
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
function loadXMLDoc(filePath) {
    try {
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        parser.parseString(fileData, (err, result) => {
            if (err) {
                console.log(err.message);
                process.exitCode = -1;
                process.exit(process.exitCode);
            }
            else {
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
    }
    catch (error) {
        console.log(error);
        process.exitCode = -1;
        process.exit(process.exitCode);
    }
}
try {
    const XMLPath = path_1.default.resolve(__dirname, 'DBConfiguration.xml');
    process.exitCode = loadXMLDoc(XMLPath);
}
catch (err) {
    if (err instanceof Error) {
        console.log(err.message);
    }
    process.exitCode = -1;
}
