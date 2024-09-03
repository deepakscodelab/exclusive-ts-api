import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import pool from '../app/db';
import Order from '../libraries/classOrder';
import { clientClose } from '../app/helpers';
import Cart from '../libraries/classCart';
import { OrderDataType } from '../types/request';

export async function placeOrder(req: Request, res: Response) {
  const {
    orderData: { userId, couponCode, shippingAmount = '0.00' },
    billingData
  } = req.body;

  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const cartDetails = await Cart.getCartItems(client, { userId });
    const { totalPrice, totalItems } = cartDetails.reduce(
      (
        acc: { totalPrice: number; totalItems: number },
        cart: { discounted_price: number; qty: number }
      ) => {
        return {
          totalPrice: acc.totalPrice + cart.discounted_price,
          totalItems: acc.totalItems + cart.qty
        };
      },
      {
        totalPrice: 0,
        totalItems: 0
      }
    );
    const orderPayload: OrderDataType = {
      userId,
      shippingAmount,
      couponCode,
      totalPrice,
      totalItems,
      paymentStatus: 'completed',
      orderStatus: 'completed'
    };

    const orderResult = await Order.saveOrder(client, orderPayload);

    if (orderResult) {
      const orderDetailPayload = { orderId: orderResult.id };
      const orderDetailsWithCartData = cartDetails.map(
        (cart: {
          id: number;
          product_id: number;
          price: number;
          qty: number;
          discount_percentage: number;
          discounted_price: number;
        }) => {
          const {
            id,
            product_id,
            price,
            qty,
            discount_percentage,
            discounted_price
          } = cart;
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
        }
      );

      const orderDetailResult = await Order.saveOrderDetails(
        client,
        orderDetailsWithCartData
      );

      if (orderDetailResult) {
        const billingPayload = {
          ...billingData,
          orderId: orderResult.id
        };
        const billingResult = await Order.saveBillingDetails(
          client,
          billingPayload
        );

        await Cart.updateCartAfterOrderPlaced(client, userId);

        if (billingResult !== null) {
          res.status(201).send({
            status: 201,
            msg: 'Order place successfully'
          });
        } else {
          res.status(400).send({ status: 400, msg: 'Something went wrong' });
        }
      }
    } else {
      res.status(400).send({ status: 400, msg: 'Something went wrong' });
    }
    client.release();
  } catch (error) {
    console.log(error);
    res.status(500).send();
    clientClose(client);
  }
}
