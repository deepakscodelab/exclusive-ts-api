"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = require("../handler/products");
const express_validator_1 = require("express-validator");
const validationSchemas_1 = require("../utils/validationSchemas");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    const response = { message: '' };
    response.message = 'Product list';
    res.status(200).send(response);
});
/**
 * @swagger
 * /product/add:
 *   post:
 *     tags:
 *       - product
 *     summary: Create a product.
 *     description: Retrieve a list of products.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 description: The product's name.
 *                 example: Addidas shoes
 *               price:
 *                 type: integer
 *                 description: The product's price.
 *                 example: 500
 *               discount_percentage:
 *                 type: integer
 *                 description: The product's discount percentage.
 *                 example: 20
 *               discounted_price:
 *                 type: integer
 *                 description: The product's discounted price.
 *                 example: 400
 *               img:
 *                 type: string
 *                 description: The product's image.
 *                 example: product.jpg
 *               review:
 *                 type: integer
 *                 description: The product's review.
 *                 example: 40
 *               rating:
 *                 type: integer
 *                 description: The product's rating.
 *                 example: 4
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     status:
 *                       type: string
 *                       description: status code
 *                       example: 201
 *                     msg:
 *                       type: string
 *                       description: success message.
 *                       example: product created successfully
 */
router.post('/add', (0, express_validator_1.checkSchema)(validationSchemas_1.createProductValidationSchema), products_1.addProduct);
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
router.get('/list', products_1.getPoductList);
exports.default = router;
