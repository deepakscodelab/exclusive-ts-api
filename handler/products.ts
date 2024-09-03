import { Request, Response } from 'express-serve-static-core';
import pool from '../app/db';
import { clientClose } from '../app/helpers';
import Product from '../libraries/classProduct';
import Common from '../libraries/classCommon';
import { CreateProduct } from '../types/request';
import { validationResult } from 'express-validator';

export async function addProduct(
  req: Request<{}, {}, CreateProduct>,
  res: Response
) {
  let client = null;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).send({ errors: errors.array() });

    client = await pool.connect();
    const productdata = req.body;
    // const productdata = matchedData(req);
    // replace this aws S3 bucket
    const products = await Product.saveProduct(client, productdata);
    if (products) {
      res.status(201).json({
        status: 201,
        msg: 'product added successfully'
      });
    } else {
      res.status(400).send({
        status: 400,
        msg: 'Something went wrong while creating new product'
      });
    }
    client.release();
  } catch (error) {
    console.log(error);
    res.status(500).send();
    clientClose(client);
  }
}

export async function getPoductList(req: Request, res: Response) {
  let client = null;
  const table = '$$SCHEMANAME$$.products';
  try {
    client = await pool.connect();
    const products = await Common.findAll(client, table);
    res.status(200).send({
      status: 200,
      data: products
    });
    client.release();
  } catch (error) {
    console.log(error);
    res.status(500).send();
    clientClose(client);
  }
}
