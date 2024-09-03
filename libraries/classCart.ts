import { PoolClient, QueryResult } from 'pg';
import { replaceSchema } from '../app/helpers';
import { AddCart } from '../types/request';

export default class Cart {
  static async addToCart(
    client: PoolClient,
    data: AddCart
  ): Promise<any[] | null> {
    const sqlStatement: string = `INSERT INTO $$SCHEMANAME$$.cart(user_id, product_id, qty, status) VALUES($1, $2, $3, $4) RETURNING id`;
    const values = [data.user_id, data.product_id, data.qty, data.status];
    const dbresult: QueryResult = await client.query(
      replaceSchema(sqlStatement),
      values
    );
    return dbresult.rowCount ? dbresult.rows : null;
  }

  static async removeFromCart(
    client: PoolClient,
    data: { id: string }
  ): Promise<any[] | null> {
    const sqlStatement: string = 'DELETE FROM $$SCHEMANAME$$.cart WHERE id=$1';
    const values = [data.id];
    const dbresult: QueryResult = await client.query(
      replaceSchema(sqlStatement),
      values
    );
    return dbresult.rowCount ? dbresult.rows : null;
  }

  static async updateItemQty(
    client: PoolClient,
    data: { productId: string; cartId: string; type: 'increment' | 'decrement' }
  ): Promise<any[] | null> {
    const { productId, cartId, type } = data;
    const sqlStatement: string =
      'select qty from $$SCHEMANAME$$.cart where product_id=$1 AND id=$2';
    const values = [productId, cartId];
    const results: QueryResult = await client.query(
      replaceSchema(sqlStatement),
      values
    );

    if (results.rowCount) {
      const updateQty =
        type === 'increment'
          ? results.rows[0].qty + 1
          : results.rows[0].qty - 1;

      const sqlStatement: string =
        'UPDATE $$SCHEMANAME$$.cart SET qty= $1 WHERE id=$2 AND product_id=$3';
      const values = [updateQty, cartId, productId];
      const dbResult = await client.query(replaceSchema(sqlStatement), values);
      return dbResult.rowCount ? dbResult.rows : null;
    }

    return null;
  }

  static async getCartItems(
    client: PoolClient,
    userId: string | string[] | undefined
  ) {
    const sqlStatement: string =
      'select sc.*, sp.product_name, sp.price, sp.discount_percentage, sp.discounted_price, sp.img, sp.review, sp.rating  from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id where user_id=$1 AND status=true';
    const values = [userId];
    const dbResult: any = await client.query(
      replaceSchema(sqlStatement),
      values
    );
    return dbResult.rowCount ? dbResult.rows : [];
  }

  static async updateCartAfterOrderPlaced(
    client: PoolClient,
    userId: string
  ): Promise<any[] | null> {
    const sqlStatement: string =
      'UPDATE $$SCHEMANAME$$.cart SET status=false WHERE status=true AND user_id=$1';
    const values = [userId];
    const dbResult = await client.query(replaceSchema(sqlStatement), values);
    return dbResult.rowCount ? dbResult.rows : null;
  }
}
