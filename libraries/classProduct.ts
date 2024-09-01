import { PoolClient } from 'pg';
import { replaceSchema } from '../app/helpers';
import { CreateProduct, AddCart } from '../types/request';

export default class Product {
  static async saveProduct(client: PoolClient, data: CreateProduct) {
    const queryStr =
      'INSERT INTO $$SCHEMANAME$$.products(product_name, price, discount_percentage, discounted_price, img, review, rating) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      data.product_name,
      data.price,
      data.discount_percentage,
      data.discounted_price,
      data.img,
      data.review,
      data.rating
    ];
    // console.log(values);
    const dbresult = await client.query(replaceSchema(queryStr), values);
    let result = null;
    // console.log(dbresult);
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }
}
