"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../app/helpers");
const pg_format_1 = __importDefault(require("pg-format"));
class Order {
    static async saveOrder(client, data) {
        const { userId, shippingAmount, totalPrice, totalItems, paymentStatus, orderStatus, cancelReason, couponCode } = data;
        const text = 'INSERT INTO $$SCHEMANAME$$.orders(user_id, shipping_amount, total_price, total_items, payment_status, order_status, cancel_reason, coupon_code) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
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
        const dbresult = await client.query((0, helpers_1.replaceSchema)(text), values);
        let result = null;
        if (dbresult.rowCount) {
            [result] = dbresult.rows;
        }
        return result;
    }
    static async saveOrderDetails(client, data) {
        const text = 'INSERT INTO $$SCHEMANAME$$.order_details (order_id, cart_id, product_id, product_price, discount_percentage, discounted_price, qty) VALUES %L RETURNING id';
        const values = data.map((item) => [
            item.orderId,
            item.cartId,
            item.productId,
            item.price,
            item.qty,
            item.discountPercentage,
            item.discountedPrice
        ]);
        // console.log(sqlStatement);
        const dbresult = await client.query((0, pg_format_1.default)((0, helpers_1.replaceSchema)(text), values));
        let result = null;
        // console.log(dbresult);
        if (dbresult.rowCount) {
            [result] = dbresult.rows;
        }
        return result;
    }
    static async saveBillingDetails(client, data) {
        const { orderId, firstName, companyName, address, apartmentAdd, city, phoneNo, email } = data;
        const text = 'INSERT INTO $$SCHEMANAME$$.billing_details(order_id, first_name, company_name, address, apartment_add, city, phone_no, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
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
        const dbresult = await client.query((0, helpers_1.replaceSchema)(text), values);
        let result = null;
        if (dbresult.rowCount) {
            [result] = dbresult.rows;
        }
        return result;
    }
}
exports.default = Order;
