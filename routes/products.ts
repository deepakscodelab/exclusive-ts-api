import express, { Router } from 'express';
import { addProduct, productList } from '../handler/products';
import { body, checkSchema } from 'express-validator';
import { createProductValidationSchema } from '../utils/validationSchemas';

const router: Router = express.Router();

router.get('/', (req, res) => {
  const response: { message: string } = { message: '' };
  response.message = 'Product list';

  res.status(200).send(response);
});

router.post(
  '/addProduct',
  checkSchema(createProductValidationSchema),
  addProduct
);

router.get('/productList', productList);

//Call function inside the routes

// router.get('/productList', async (req, res) => {
//   let client = null;
//   const table = '$$SCHEMANAME$$.products';
//   try {
//     client = await pool.connect();
//     const products = await Common.findAll(client, table);
//     res.status(200).send({
//       token: 'JWT',
//       products
//     });
//     client.release();
//   } catch (error) {
//     console.log(error);
//     res.status(500).send();
//     clientClose(client);
//   }
// });

export default router;
