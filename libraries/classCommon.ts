import { PoolClient } from 'pg';
import { replaceSchema } from '../app/helpers';

export default class Common {
  static async findById(client: PoolClient, table: string, id: string) {
    const sqlStatement = `select * from ${table} where id=$1`;
    const dbresult = await client.query(replaceSchema(sqlStatement), [id]);
    let result = null;
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }

  static async findOne(
    client: PoolClient,
    table: string,
    name: string,
    value: string
  ) {
    const sqlStatement = `select * from ${table} where ${name}=$1`;
    const dbresult = await client.query(replaceSchema(sqlStatement), [value]);
    let result = null;
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }

  static async findAll(client: PoolClient, table: string) {
    const sqlStatement = `select * from ${table} `;
    const dbResult = await client.query(replaceSchema(sqlStatement));
    return dbResult.rowCount ? dbResult.rows : [];
  }
}
