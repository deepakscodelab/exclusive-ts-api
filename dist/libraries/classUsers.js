"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../app/helpers");
class User {
    static async saveUser(client, data) {
        const text = 'INSERT INTO $$SCHEMANAME$$.users(first_name, last_name,email,phone_number,fax,password,company,address1,address2,city,postcode) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';
        const values = [
            data.first_name,
            data.last_name,
            data.email,
            data.phone_number,
            data.fax,
            data.password,
            data.company,
            data.address1,
            data.address2,
            data.city,
            data.postcode
        ];
        const dbresult = await client.query((0, helpers_1.replaceSchema)(text), values);
        let result = null;
        if (dbresult.rowCount) {
            result = dbresult.rows[0];
        }
        return result;
    }
    static async comparePassword(candidatePassword, password) {
        let isMatch = null;
        if (candidatePassword === password) {
            isMatch = true;
        }
        else {
            isMatch = false;
        }
        return isMatch;
    }
}
exports.default = User;
