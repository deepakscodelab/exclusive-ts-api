"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../app/helpers");
class Common {
    static async findById(client, table, id) {
        const sqlStatement = `select * from ${table} where id=$1`;
        const dbresult = await client.query((0, helpers_1.replaceSchema)(sqlStatement), [id]);
        let result = null;
        if (dbresult.rowCount) {
            [result] = dbresult.rows;
        }
        return result;
    }
    static async findOne(client, table, name, value) {
        const sqlStatement = `select * from ${table} where ${name}=$1`;
        const dbresult = await client.query((0, helpers_1.replaceSchema)(sqlStatement), [value]);
        let result = null;
        if (dbresult.rowCount) {
            [result] = dbresult.rows;
        }
        return result;
    }
    static async findAll(client, table) {
        const sqlStatement = `select * from ${table} `;
        const dbResult = await client.query((0, helpers_1.replaceSchema)(sqlStatement));
        return dbResult.rowCount ? dbResult.rows : [];
    }
}
exports.default = Common;
