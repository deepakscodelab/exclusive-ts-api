"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidationSchema = void 0;
exports.createProductValidationSchema = {
    product_name: {
        notEmpty: {
            errorMessage: 'Product name cannot be empty'
        }
    },
    price: {
        notEmpty: {
            errorMessage: 'Price cannot be empty'
        }
    },
    discount_percentage: {
        notEmpty: {
            errorMessage: 'Discount percentage cannot be empty'
        }
    },
    discounted_price: {
        notEmpty: {
            errorMessage: 'Discounted price cannot be empty'
        }
    },
    img: {
        notEmpty: {
            errorMessage: 'Image cannot be empty'
        }
    }
};
