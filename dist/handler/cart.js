"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.updateItemQty = updateItemQty;
exports.getCartItems = getCartItems;
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../app/db"));
const helpers_1 = require("../app/helpers");
const classCart_1 = __importDefault(require("../libraries/classCart"));
async function addToCart(req, res) {
    let client = null;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).send({ errors: errors.array() });
        client = await db_1.default.connect();
        const data = req.body;
        const result = await classCart_1.default.addToCart(client, data);
        if (result) {
            res.status(200).send({ msg: 'Product added into the cart' });
        }
        else {
            res.status(400).send({
                msg: 'Something went wrong. Not able to add cart'
            });
        }
        client.release();
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
        (0, helpers_1.clientClose)(client);
    }
}
async function removeFromCart(req, res) {
    let client = null;
    const { id } = req.params;
    const payload = { id };
    try {
        client = await db_1.default.connect();
        const result = await classCart_1.default.removeFromCart(client, payload);
        if (result) {
            res.status(200).send({ msg: 'item removed from cart' });
        }
        else {
            res.status(400).send({ msg: 'failed to remove cart item' });
        }
        client.release();
    }
    catch (error) {
        res.status(500).send(error);
        (0, helpers_1.clientClose)(client);
    }
}
async function updateItemQty(req, res) {
    let client = null;
    const { productId, cartId, type } = req.body;
    const payload = {
        productId,
        cartId,
        type
    };
    try {
        client = await db_1.default.connect();
        const result = await classCart_1.default.updateItemQty(client, payload);
        if (result) {
            res.status(200).send({ msg: 'Qty successfully updated' });
        }
        else {
            res.status(400).send({ msg: 'Not able to update quantity' });
        }
        client.release();
    }
    catch (error) {
        res.status(500).send(error);
        (0, helpers_1.clientClose)(client);
    }
}
async function getCartItems(req, res) {
    let client = null;
    const { userId } = req.params;
    const payload = { userId };
    try {
        client = await db_1.default.connect();
        const result = await classCart_1.default.getCartItems(client, payload);
        if (result) {
            res.status(200).send(result);
        }
        else {
            res.status(400).send({ msg: 'Error while fetching data' });
        }
        client.release();
    }
    catch (error) {
        res.status(500).send(error);
        (0, helpers_1.clientClose)(client);
    }
}
