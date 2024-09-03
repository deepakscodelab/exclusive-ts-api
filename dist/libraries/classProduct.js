"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../app/helpers");
class Product {
    static async saveProduct(client, data) {
        const queryStr = 'INSERT INTO $$SCHEMANAME$$.products(product_name, price, discount_percentage, discounted_price, img, review, rating) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const values = [
            data.product_name,
            data.price,
            data.discount_percentage,
            data.discounted_price,
            data.img,
            data.review,
            data.rating
        ];
        const dbresult = await client.query((0, helpers_1.replaceSchema)(queryStr), values);
        return dbresult.rowCount ? dbresult.rows : null;
    }
}
exports.default = Product;
