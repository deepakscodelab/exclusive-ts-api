import express, { Router } from 'express';
import { addProduct, getPoductList } from '../handler/products';
import { checkSchema } from 'express-validator';
import { createProductValidationSchema } from '../utils/validationSchemas';

const router: Router = express.Router();

router.get('/', (req, res) => {
  const response: { message: string } = { message: '' };
  response.message = 'Product list';
  res.status(200).send(response);
});

/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: Create a product.
 *     description: Retrieve a list of products.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The product's name.
 *                 example: Addidas shoes
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       description: success message.
 *                       example: product created successfully
 */
router.post('/add', checkSchema(createProductValidationSchema), addProduct);

/**
 * @swagger
 * /product/list:
 *   get:
 *     tags:
 *       - product
 *     summary: Retrieve a list of products.
 *     description: Retrieve a list of products.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The product ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The product's name.
 *                         example: Addidas shoes
 *                       price:
 *                         type: integer
 *                         description: price of product.
 *                         example: 300
 *                       discount_percentage:
 *                         type: integer
 *                         description: discount on product.
 *                         example: 10
 *                       discounted_price:
 *                         type: integer
 *                         description: discounted price.
 *                         example: 270
 *                       img:
 *                         type: string
 *                         description: product's image.
 *                         example: product1.png
 *                       review:
 *                         type: integer
 *                         description: product's review.
 *                         example: 10
 *                       rating:
 *                         type: integer
 *                         description: product's rating.
 *                         example: 4
 */
router.get('/list', getPoductList);

export default router;
