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

router.get('/list/:userId', getCartItems);

router.delete('/delete/:id', removeFromCart);

router.put('/updateItemQuantity', updateItemQty);

export default router;
