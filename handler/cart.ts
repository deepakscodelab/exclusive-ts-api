import { validationResult } from 'express-validator';
import { Request, Response } from 'express-serve-static-core';
import pool from '../app/db';
import { clientClose } from '../app/helpers';
import Cart from '../libraries/classCart';
import { PoolClient } from 'pg';

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
      res.status(200).send({ msg: 'Product added into the cart' });
    } else {
      res.status(400).send({
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
      res.status(200).send({ msg: 'item removed from cart' });
    } else {
      res.status(400).send({ msg: 'failed to remove cart item' });
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
      res.status(200).send({ msg: 'Qty successfully updated' });
    } else {
      res.status(400).send({ msg: 'Not able to update quantity' });
    }
    client.release();
  } catch (error) {
    res.status(500).send(error);
    clientClose(client);
  }
}

export async function getCartItems(req: Request, res: Response) {
  let client = null;
  const { userId } = req.params;
  const payload = { userId };
  try {
    client = await pool.connect();
    const result = await Cart.getCartItems(client, payload);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send({ msg: 'Error while fetching data' });
    }
    client.release();
  } catch (error) {
    res.status(500).send(error);
    clientClose(client);
  }
}
