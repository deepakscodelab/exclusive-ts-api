"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../app/helpers");
class Cart {
    static async addToCart(client, data) {
        const sqlStatement = `INSERT INTO $$SCHEMANAME$$.cart(user_id, product_id, qty, status) VALUES($1, $2, $3, $4) RETURNING id`;
        const values = [data.user_id, data.product_id, data.qty, data.status];
        const dbresult = await client.query((0, helpers_1.replaceSchema)(sqlStatement), values);
        return dbresult.rowCount ? dbresult.rows : null;
    }
    static async removeFromCart(client, data) {
        const sqlStatement = 'DELETE FROM $$SCHEMANAME$$.cart WHERE id=$1';
        const values = [data.id];
        const dbresult = await client.query((0, helpers_1.replaceSchema)(sqlStatement), values);
        return dbresult.rowCount ? dbresult.rows : null;
    }
    static async updateItemQty(client, data) {
        const { productId, cartId, type } = data;
        const sqlStatement = 'select qty from $$SCHEMANAME$$.cart where product_id=$1 AND id=$2';
        const values = [productId, cartId];
        const results = await client.query((0, helpers_1.replaceSchema)(sqlStatement), values);
        if (results.rowCount) {
            const updateQty = type === 'increment'
                ? results.rows[0].qty + 1
                : results.rows[0].qty - 1;
            const sqlStatement = 'UPDATE $$SCHEMANAME$$.cart SET qty= $1 WHERE id=$2 AND product_id=$3';
            const values = [updateQty, cartId, productId];
            const dbResult = await client.query((0, helpers_1.replaceSchema)(sqlStatement), values);
            return dbResult.rowCount ? dbResult.rows : null;
        }
        return null;
    }
    static async getCartItems(client, data) {
        const { userId } = data;
        const sqlStatement = 'select sc.*, sp.product_name, sp.price, sp.discount_percentage, sp.discounted_price, sp.img, sp.review, sp.rating  from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id where user_id=$1 AND status=true';
        const values = [userId];
        const dbResult = await client.query((0, helpers_1.replaceSchema)(sqlStatement), values);
        return dbResult.rowCount ? dbResult.rows : [];
    }
    static async updateCartAfterOrderPlaced(client, userId) {
        const sqlStatement = 'UPDATE $$SCHEMANAME$$.cart SET status=false WHERE status=true AND user_id=$1';
        const values = [userId];
        const dbResult = await client.query((0, helpers_1.replaceSchema)(sqlStatement), values);
        return dbResult.rowCount ? dbResult.rows : null;
    }
}
exports.default = Cart;
