"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = require("../handler/cart");
const express_validator_1 = require("express-validator");
const validationSchemas_1 = require("../utils/validationSchemas");
const router = express_1.default.Router();
router.post('/add', (0, express_validator_1.checkSchema)(validationSchemas_1.createCartValidationSchema), cart_1.addToCart);
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
router.get('/list/:userId', cart_1.getCartItems);
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
router.delete('/delete/:id', cart_1.removeFromCart);
router.put('/updateItemQuantity', cart_1.updateItemQty);
exports.default = router;
