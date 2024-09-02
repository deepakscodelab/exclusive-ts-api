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
router.get('/list/:userId', cart_1.getCartItems);
router.delete('/delete/:id', cart_1.removeFromCart);
router.put('/updateItemQuantity', cart_1.updateItemQty);
exports.default = router;
