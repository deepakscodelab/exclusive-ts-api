"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../app/helpers");
class Product {
    static async saveProduct(client, data) {
        const text = 'INSERT INTO $$SCHEMANAME$$.products(product_name, price, discount_percentage, discounted_price, img, review, rating) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
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
        const dbresult = await client.query((0, helpers_1.replaceSchema)(text), values);
        let result = null;
        // console.log(dbresult);
        if (dbresult.rowCount) {
            [result] = dbresult.rows;
        }
        return result;
    }
    static async addToCart(client, data) {
        const updatedResult = {};
        const sqlStatement = `INSERT INTO $$SCHEMANAME$$.cart(user_id, product_id, qty, status) VALUES($1, $2, $3, $4) RETURNING id', [${data.user_id}, ${data.product_id}, ${data.qty}, ${data.status}]`;
        if (await client.query((0, helpers_1.replaceSchema)(sqlStatement))) {
            const sqlStatement = 'select sc.*,sp.product_image,sp.product_name,sp.price,sp.brand,sp.color from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
            const results = await client.query((0, helpers_1.replaceSchema)(sqlStatement));
            if (results.rowCount) {
                const sqlStatement1 = 'select sc.product_id,sp.product_image,SUM(sc.qty*sp.price) as total_price from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
                const res = await client.query((0, helpers_1.replaceSchema)(sqlStatement1));
                if (res.rowCount) {
                    updatedResult.cart_price = res[0].total_price;
                    updatedResult[0] = results;
                }
            }
        }
        return updatedResult;
    }
    static async removeFromCart(client, data) {
        const updatedResult = {};
        const sqlStatement = `DELETE FROM $$SCHEMANAME$$.cart WHERE id=$1,[${data.id}]`;
        if (await client.query((0, helpers_1.replaceSchema)(sqlStatement))) {
            const sqlStatement = 'select sc.*,sp.product_image,sp.product_name,sp.price,sp.brand,sp.color from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
            const results = await client.query((0, helpers_1.replaceSchema)(sqlStatement));
            if (results.rowCount) {
                const sqlStatement1 = 'select sc.product_id,sp.product_image,SUM(sc.qty*sp.price) as total_price from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
                const res = await client.query((0, helpers_1.replaceSchema)(sqlStatement1));
                if (res.rowCount) {
                    updatedResult.cart_price = res[0].total_price;
                    updatedResult[0] = results;
                }
            }
        }
        return updatedResult;
    }
    static async updateItemQty(client, productId, type) {
        const updatedResult = {};
        const sqlStatement = `select qty from $$SCHEMANAME$$.cart where product_id=$1,[${productId}]`;
        const results = await client.query((0, helpers_1.replaceSchema)(sqlStatement));
        if (results.rowCount) {
            let updateQty;
            if (type === 'increment') {
                updateQty = results[0].qty + 1;
            }
            else {
                updateQty = results[0].qty - 1;
            }
            const sqlStatement = `UPDATE $$SCHEMANAME$$.cart SET qty= $1 WHERE product_id=$2,[${updateQty}, ${productId}]`;
            if (await client.query((0, helpers_1.replaceSchema)(sqlStatement))) {
                const sqlStatement = 'select sc.*,sp.product_image,sp.product_name,sp.price,sp.brand,sp.color from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
                const results = await client.query((0, helpers_1.replaceSchema)(sqlStatement));
                if (results.rowCount) {
                    const sqlStatement1 = 'select sc.product_id,sp.product_image,SUM(sc.qty*sp.price) as total_price from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
                    const res = await client.query((0, helpers_1.replaceSchema)(sqlStatement1));
                    if (res.rowCount) {
                        updatedResult.cart_price = res[0].total_price;
                        updatedResult[0] = results;
                    }
                }
            }
        }
        return updatedResult;
    }
    static async userCartItems(client) {
        const updatedResult = {};
        const sqlStatement = 'select sc.*,sp.product_image,sp.product_name,sp.price,sp.brand,sp.color  from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
        const results = await client.query((0, helpers_1.replaceSchema)(sqlStatement));
        if (results.rowCount) {
            const sqlStatement1 = 'select sc.product_id,sp.product_image,SUM(sc.qty*sp.price) as total_price from $$SCHEMANAME$$.cart sc left join $$SCHEMANAME$$.products sp ON sc.product_id=sp.id';
            const res = await client.query((0, helpers_1.replaceSchema)(sqlStatement1));
            if (res.rowCount) {
                updatedResult.cart_price = res[0].total_price;
                updatedResult[0] = results;
            }
        }
        return updatedResult;
    }
}
exports.default = Product;
