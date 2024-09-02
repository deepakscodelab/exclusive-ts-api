"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = require("../handler/order");
const router = express_1.default.Router();
router.post('/placeOrder', order_1.placeOrder);
exports.default = router;
