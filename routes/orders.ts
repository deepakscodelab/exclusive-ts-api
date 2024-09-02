import express, { Router } from 'express';
import { placeOrder } from '../handler/order';

const router: Router = express.Router();

router.post('/placeOrder', placeOrder);

export default router;
