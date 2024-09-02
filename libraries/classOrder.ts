import { PoolClient } from 'pg';
import { replaceSchema } from '../app/helpers';
import { OrderDataType } from '../types/request';
import format from 'pg-format';

interface OrderDetails {
  orderId: number;
  cartId: number;
  productId: number;
  price: number;
  qty: number;
  discountPercentage: number;
  discountedPrice: number;
}

interface BillingDetails {
  orderId: number;
  firstName: string;
  companyName: string;
  address: string;
  apartmentAdd: string;
  city: string;
  phoneNo: string;
  email: string;
}

export default class Order {
  static async saveOrder(client: PoolClient, data: OrderDataType) {
    const {
      userId,
      shippingAmount,
      totalPrice,
      totalItems,
      paymentStatus,
      orderStatus,
      cancelReason,
      couponCode
    } = data;
    const text =
      'INSERT INTO $$SCHEMANAME$$.orders(user_id, shipping_amount, total_price, total_items, payment_status, order_status, cancel_reason, coupon_code) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [
      userId,
      shippingAmount,
      totalPrice,
      totalItems,
      paymentStatus,
      orderStatus,
      cancelReason,
      couponCode
    ];
    const dbresult = await client.query(replaceSchema(text), values);
    let result = null;
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }

  static async saveOrderDetails(client: PoolClient, data: OrderDetails[]) {
    const text =
      'INSERT INTO $$SCHEMANAME$$.order_details (order_id, cart_id, product_id, product_price, discount_percentage, discounted_price, qty) VALUES %L RETURNING id';
    const values = data.map(
      (item: {
        orderId: number;
        cartId: number;
        productId: number;
        price: number;
        qty: number;
        discountPercentage: number;
        discountedPrice: number;
      }) => [
        item.orderId,
        item.cartId,
        item.productId,
        item.price,
        item.qty,
        item.discountPercentage,
        item.discountedPrice
      ]
    );
    // console.log(sqlStatement);
    const dbresult = await client.query(format(replaceSchema(text), values));
    let result = null;
    // console.log(dbresult);
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }

  static async saveBillingDetails(client: PoolClient, data: BillingDetails) {
    const {
      orderId,
      firstName,
      companyName,
      address,
      apartmentAdd,
      city,
      phoneNo,
      email
    } = data;

    const text =
      'INSERT INTO $$SCHEMANAME$$.billing_details(order_id, first_name, company_name, address, apartment_add, city, phone_no, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
    const values = [
      orderId,
      firstName,
      companyName,
      address,
      apartmentAdd,
      city,
      phoneNo,
      email
    ];
    const dbresult = await client.query(replaceSchema(text), values);
    let result = null;
    if (dbresult.rowCount) {
      [result] = dbresult.rows;
    }
    return result;
  }
}
