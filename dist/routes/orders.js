"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// router.post('/placeOrder', (req, res) => {
//   const postData = req.body;
//   const orderData = postData.order_data;
//   const cartDetails = postData.cart_details;
//   const shippingAddress = postData.shipping_address;
//   (async () => {
//     let client: PoolClient | null = null;
//     try {
//       client = await pool.connect();
//       const orderdata = await Order.saveOrder(client!, orderData);
//       if (!orderdata) {
//         // If email is unique and password was provided, create account
//         //  console.log(cartDetails);
//         const orderDetails = [];
//         for (let i = 0; i < cartDetails.length; i++) {
//           // console.log('here');
//           // console.log(cartDetails[i]);
//           orderDetails.push([orderdata.insertId, cartDetails[i].id]);
//         }
//         const orderDetails1 = await Order.saveOrderDetails(
//           client!,
//           orderDetails
//         );
//         // console.log(orderDetails);
//         if (!orderDetails1) {
//           shippingAddress.order_id = orderdata.insertId;
//           const shippingDtails = await Order.saveShippingDetails(
//             client,
//             shippingAddress
//           );
//           if (shippingDtails !== null) {
//             res.status(200).json({
//               data: orderdata,
//               msg: 'Order place successfully'
//             });
//           } else {
//             res.status(404).send('Something went wrong');
//           }
//         }
//       } else {
//         res.status(404).send({ error: 'Something went wrong' });
//       }
//       client.release();
//     } catch (error) {
//       res.status(500).send();
//       clientClose(client);
//     }
//   })();
// });
exports.default = router;
