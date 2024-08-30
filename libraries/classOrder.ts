import { PoolClient } from 'pg';
import { replaceSchema } from '../app/helpers';

interface OrderData {
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

interface OrderDetails {
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

interface ShippingDetails {
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

export default class Order {
  static async saveOrder(client: PoolClient, data: OrderData) {
    const text =
      'INSERT INTO $$SCHEMANAME$$.users(first_name, last_name,email,phone_number,fax,password,company,address1,address2,city,postcode) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';
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
    // console.log(sqlStatement);
    const dbresult = await client.query(replaceSchema(text), values);
    let result = null;
    // console.log(dbresult);
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }

  static async saveOrderDetails(client: PoolClient, data: OrderDetails) {
    const text =
      'INSERT INTO $$SCHEMANAME$$.users(first_name, last_name,email,phone_number,fax,password,company,address1,address2,city,postcode) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';
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
    // console.log(sqlStatement);
    const dbresult = await client.query(replaceSchema(text), values);
    let result = null;
    // console.log(dbresult);
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }

  static async saveShippingDetails(client: PoolClient, data: ShippingDetails) {
    const text =
      'INSERT INTO $$SCHEMANAME$$.users(first_name, last_name,email,phone_number,fax,password,company,address1,address2,city,postcode) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';
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
    // console.log(sqlStatement);
    const dbresult = await client.query(replaceSchema(text), values);
    let result = null;
    // console.log(dbresult);
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }
}
