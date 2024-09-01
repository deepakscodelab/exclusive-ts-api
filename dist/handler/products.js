"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = addProduct;
exports.productList = productList;
const db_1 = __importDefault(require("../app/db"));
const helpers_1 = require("../app/helpers");
const classProduct_1 = __importDefault(require("../libraries/classProduct"));
const classCommon_1 = __importDefault(require("../libraries/classCommon"));
const express_validator_1 = require("express-validator");
async function addProduct(req, res) {
    let client = null;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).send({ errors: errors.array() });
        client = await db_1.default.connect();
        const productdata = req.body;
        // const productdata = matchedData(req);
        // replace this aws S3 bucket
        const products = await classProduct_1.default.saveProduct(client, productdata);
        if (products) {
            res.status(200).json({
                msg: 'product added successfully'
            });
        }
        else {
            res.status(404).send({ msg: 'user not exits' });
        }
        client.release();
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
        (0, helpers_1.clientClose)(client);
    }
}
async function productList(req, res) {
    let client = null;
    const table = '$$SCHEMANAME$$.products';
    try {
        client = await db_1.default.connect();
        const products = await classCommon_1.default.findAll(client, table);
        res.status(200).send({
            token: 'JWT',
            products
        });
        client.release();
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
        (0, helpers_1.clientClose)(client);
    }
}
