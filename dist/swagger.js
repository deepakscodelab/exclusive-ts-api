"use strict";
const swaggerJSDoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'APi for Exclusive app',
            version: '1.0.0',
            description: 'This is a REST API application made with Express',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html'
            },
            contact: {
                name: 'Deepak Sharma',
                url: 'https://exclusive-ts-api.vercel.app'
            }
        },
        servers: [
            {
                url: 'https://exclusive-ts-api.vercel.app/api/v1',
                description: 'Production server'
            },
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'product',
                description: 'Everything about your Products'
            },
            {
                name: 'cart',
                description: 'Everything about your Cart'
            }
        ]
    },
    apis: ['./routes/*.ts'] // Path to your API routes
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
