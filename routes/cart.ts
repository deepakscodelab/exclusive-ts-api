import express, { Router } from 'express';
import {
  addToCart,
  getCartItems,
  removeFromCart,
  updateItemQty
} from '../handler/cart';
import { checkSchema } from 'express-validator';
import { createCartValidationSchema } from '../utils/validationSchemas';

const router: Router = express.Router();

router.post('/add', checkSchema(createCartValidationSchema), addToCart);

/**
 * @swagger
 * /cart/list:
 *   get:
 *     tags:
 *       - cart
 *     summary: Retrieve a user's cart data.
 *     description: Retrieve a user's cart data.
 *     parameters:
 *       - in: header
 *         name: X-Request-ID
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's cart data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The cart ID.
 *                       example: 1
 *                     product_name:
 *                       type: string
 *                       description: The product's name.
 *                       example: Addidas shoes
 */

// userId need to move from path to request header
router.get('/list', getCartItems);

/**
 * @swagger
 * /cart/delete/{id}:
 *   delete:
 *     tags:
 *       - cart
 *     summary: Delete produc from cart.
 *     description: Delete the product from the cart.
 *     parameters:
 *       - in: header
 *         name: X-Request-ID
 *         required: true
 *         description: Numeric ID of the user.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to delete from the cart.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
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
 *                       example: product successfully deleted from the cart
 */
router.delete('/delete/:id', removeFromCart);

router.put('/updateItemQuantity', updateItemQty);

export default router;
