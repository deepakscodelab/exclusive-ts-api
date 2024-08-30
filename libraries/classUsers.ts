import { PoolClient } from 'pg';
import { replaceSchema } from '../app/helpers';

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  fax: string;
  password: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
}

export default class User {
  static async saveUser(client: PoolClient, data: UserData): Promise<any> {
    const text: string =
      'INSERT INTO $$SCHEMANAME$$.users(first_name, last_name,email,phone_number,fax,password,company,address1,address2,city,postcode) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';
    const values: (string | null)[] = [
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
    const dbresult: any = await client.query(replaceSchema(text), values);
    let result: any = null;
    if (dbresult.rowCount) {
      result = dbresult.rows[0];
    }
    return result;
  }

  static async comparePassword(candidatePassword: string, password: string) {
    let isMatch = null;
    if (candidatePassword === password) {
      isMatch = true;
    } else {
      isMatch = false;
    }
    return isMatch;
  }
}
