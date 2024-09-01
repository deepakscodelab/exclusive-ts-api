import { PoolClient } from 'pg';
import { replaceSchema } from '../app/helpers';
import { CreateProduct, AddCart } from '../types/request';

export default class Product {
  static async saveProduct(client: PoolClient, data: CreateProduct) {
    const text =
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
    const dbresult = await client.query(replaceSchema(text), values);
    let result = null;
    // console.log(dbresult);
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }

  static async addToCart(
    client: PoolClient,
    data: AddCart
  ): Promise<{ cart_price?: number; [key: number]: any }> {
    const updatedResult: { cart_price?: number; [key: number]: any } = {};
    const sqlStatement: string = `INSERT INTO $$SCHEMANAME$$.cart(user_id, product_id, qty, status) VALUES($1, $2, $3, $4) RETURNING id', [${data.user_id}, ${data.product_id}, ${data.qty}, ${data.status}]`;
    if (await client.query(replaceSchema(sqlStatement))) {
      const sqlStatement: string =
        'select sc.*,sp.product_image,sp.product_name,sp.price,sp.brand,sp.color from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
      const results: any = await client.query(replaceSchema(sqlStatement));
      if (results.rowCount) {
        const sqlStatement1: string =
          'select sc.product_id,sp.product_image,SUM(sc.qty*sp.price) as total_price from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
        const res: any = await client.query(replaceSchema(sqlStatement1));
        if (res.rowCount) {
          updatedResult.cart_price = res[0].total_price;
          updatedResult[0] = results;
        }
      }
    }

    return updatedResult;
  }

  static async removeFromCart(
    client: PoolClient,
    data: { id: string }
  ): Promise<{ cart_price?: number; [key: number]: any }> {
    const updatedResult: { cart_price?: number; [key: number]: any } = {};
    const sqlStatement: string = `DELETE FROM $$SCHEMANAME$$.cart WHERE id=$1,[${data.id}]`;
    if (await client.query(replaceSchema(sqlStatement))) {
      const sqlStatement: string =
        'select sc.*,sp.product_image,sp.product_name,sp.price,sp.brand,sp.color from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
      const results: any = await client.query(replaceSchema(sqlStatement));
      if (results.rowCount) {
        const sqlStatement1: string =
          'select sc.product_id,sp.product_image,SUM(sc.qty*sp.price) as total_price from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
        const res: any = await client.query(replaceSchema(sqlStatement1));
        if (res.rowCount) {
          updatedResult.cart_price = res[0].total_price;
          updatedResult[0] = results;
        }
      }
    }

    return updatedResult;
  }

  static async updateItemQty(
    client: PoolClient,
    productId: string,
    type: 'increment' | 'decrement'
  ): Promise<{ cart_price?: number; [key: number]: any }> {
    const updatedResult: { cart_price?: number; [key: number]: any } = {};
    const sqlStatement: string = `select qty from $$SCHEMANAME$$.cart where product_id=$1,[${productId}]`;
    const results: any = await client.query(replaceSchema(sqlStatement));
    if (results.rowCount) {
      let updateQty: number;
      if (type === 'increment') {
        updateQty = results[0].qty + 1;
      } else {
        updateQty = results[0].qty - 1;
      }

      const sqlStatement: string = `UPDATE $$SCHEMANAME$$.cart SET qty= $1 WHERE product_id=$2,[${updateQty}, ${productId}]`;
      if (await client.query(replaceSchema(sqlStatement))) {
        const sqlStatement: string =
          'select sc.*,sp.product_image,sp.product_name,sp.price,sp.brand,sp.color from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
        const results: any = await client.query(replaceSchema(sqlStatement));
        if (results.rowCount) {
          const sqlStatement1: string =
            'select sc.product_id,sp.product_image,SUM(sc.qty*sp.price) as total_price from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
          const res: any = await client.query(replaceSchema(sqlStatement1));
          if (res.rowCount) {
            updatedResult.cart_price = res[0].total_price;
            updatedResult[0] = results;
          }
        }
      }
    }
    return updatedResult;
  }

  static async userCartItems(
    client: PoolClient
  ): Promise<{ cart_price?: number; [key: number]: any }> {
    const updatedResult: { cart_price?: number; [key: number]: any } = {};
    const sqlStatement: string =
      'select sc.*,sp.product_image,sp.product_name,sp.price,sp.brand,sp.color  from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
    const results: any = await client.query(replaceSchema(sqlStatement));
    if (results.rowCount) {
      const sqlStatement1: string =
        'select sc.product_id,sp.product_image,SUM(sc.qty*sp.price) as total_price from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
      const res: any = await client.query(replaceSchema(sqlStatement1));
      if (res.rowCount) {
        updatedResult.cart_price = res[0].total_price;
        updatedResult[0] = results;
      }
    }
    return updatedResult;
  }
}
