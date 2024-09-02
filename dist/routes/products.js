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
router.post('/add', (0, express_validator_1.checkSchema)(validationSchemas_1.createProductValidationSchema), products_1.addProduct);
router.get('/list', products_1.getPoductList);
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
exports.default = router;
