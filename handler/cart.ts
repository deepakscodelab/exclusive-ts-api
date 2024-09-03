import { validationResult } from 'express-validator';
import { Request, Response } from 'express-serve-static-core';
import pool from '../app/db';
import { clientClose } from '../app/helpers';
import Cart from '../libraries/classCart';

export async function addToCart(req: Request, res: Response) {
  let client = null;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).send({ errors: errors.array() });

    client = await pool.connect();
    const data = req.body;
    const result = await Cart.addToCart(client, data);
    if (result) {
      res.status(201).send({ status: 201, msg: 'Product added into the cart' });
    } else {
      res.status(400).send({
        status: 400,
        msg: 'Something went wrong. Not able to add cart'
      });
    }
    client.release();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    clientClose(client);
  }
}

export async function removeFromCart(req: Request, res: Response) {
  let client = null;
  const { id } = req.params;
  const payload = { id };
  try {
    client = await pool.connect();
    const result = await Cart.removeFromCart(client, payload);
    if (result) {
      res.status(200).send({ status: 200, msg: 'item removed from cart' });
    } else {
      res.status(400).send({ status: 400, msg: 'failed to remove cart item' });
    }
    client.release();
  } catch (error) {
    res.status(500).send(error);
    clientClose(client);
  }
}

export async function updateItemQty(req: Request, res: Response) {
  let client = null;
  const { productId, cartId, type } = req.body;
  const payload: {
    productId: string;
    cartId: string;
    type: 'increment' | 'decrement';
  } = {
    productId,
    cartId,
    type
  };
  try {
    client = await pool.connect();
    const result = await Cart.updateItemQty(client, payload);

    if (result) {
      res.status(200).send({ status: 200, msg: 'Qty successfully updated' });
    } else {
      res.status(400).send({ status: 400, msg: 'Not able to update quantity' });
    }
    client.release();
  } catch (error) {
    res.status(500).send(error);
    clientClose(client);
  }
}

export async function getCartItems(req: Request, res: Response) {
  let client = null;
  const userId = req.headers['x-request-id'];
  try {
    client = await pool.connect();
    const result = await Cart.getCartItems(client, userId);
    if (result) {
      res.status(200).send({ status: 200, data: result });
    } else {
      res.status(400).send({ status: 400, msg: 'Error while fetching data' });
    }
    client.release();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    clientClose(client);
  }
}
