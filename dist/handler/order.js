"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = placeOrder;
const db_1 = __importDefault(require("../app/db"));
const classOrder_1 = __importDefault(require("../libraries/classOrder"));
const helpers_1 = require("../app/helpers");
const classCart_1 = __importDefault(require("../libraries/classCart"));
async function placeOrder(req, res) {
    const { orderData: { userId, couponCode, shippingAmount = '0.00' }, billingData } = req.body;
    let client = null;
    try {
        client = await db_1.default.connect();
        const cartDetails = await classCart_1.default.getCartItems(client, userId);
        const { totalPrice, totalItems } = cartDetails.reduce((acc, cart) => {
            return {
                totalPrice: acc.totalPrice + cart.discounted_price,
                totalItems: acc.totalItems + cart.qty
            };
        }, {
            totalPrice: 0,
            totalItems: 0
        });
        const orderPayload = {
            userId,
            shippingAmount,
            couponCode,
            totalPrice,
            totalItems,
            paymentStatus: 'completed',
            orderStatus: 'completed'
        };
        const orderResult = await classOrder_1.default.saveOrder(client, orderPayload);
        if (orderResult) {
            const orderDetailPayload = { orderId: orderResult.id };
            const orderDetailsWithCartData = cartDetails.map((cart) => {
                const { id, product_id, price, qty, discount_percentage, discounted_price } = cart;
                return {
                    ...orderDetailPayload,
                    ...{
                        cartId: id,
                        productId: product_id,
                        price,
                        qty,
                        discountPercentage: discount_percentage,
                        discountedPrice: discounted_price
                    }
                };
            });
            const orderDetailResult = await classOrder_1.default.saveOrderDetails(client, orderDetailsWithCartData);
            if (orderDetailResult) {
                const billingPayload = {
                    ...billingData,
                    orderId: orderResult.id
                };
                const billingResult = await classOrder_1.default.saveBillingDetails(client, billingPayload);
                await classCart_1.default.updateCartAfterOrderPlaced(client, userId);
                if (billingResult !== null) {
                    res.status(201).send({
                        status: 201,
                        msg: 'Order place successfully'
                    });
                }
                else {
                    res.status(400).send({ status: 400, msg: 'Something went wrong' });
                }
            }
        }
        else {
            res.status(400).send({ status: 400, msg: 'Something went wrong' });
        }
        client.release();
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
        (0, helpers_1.clientClose)(client);
    }
}
