"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Import the swagger configuration
// Register the routes
const authentication_1 = __importDefault(require("./routes/authentication"));
const products_1 = __importDefault(require("./routes/products"));
const cart_1 = __importDefault(require("./routes/cart"));
const orders_1 = __importDefault(require("./routes/orders"));
const app = (0, express_1.default)();
// Routes for APIs
const router = express_1.default.Router();
const env = process.env.NODE_ENV || 'development';
app.set('port', process.env.PORT || 3000);
if (env === 'production') {
    // app.use(forceSsl);
}
// Swagger setup
// CDN CSS
const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';
// const JS_URL = [
//   './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
//   './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js'
// ];
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL
})
// swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL, customJs: JS_URL })
);
// till here
app.use('/api', router);
// Setting up basic middleware for all Express requests
app.use(body_parser_1.default.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(body_parser_1.default.json()); // Send JSON responses
app.disable('x-powered-by');
// Enable CORS from client-side
app.use((req, res, next) => {
    const originUrl = process.env.NODE_ENV === 'production'
        ? 'https://tilesonweb.herokuapp.com'
        : 'http://localhost:8080';
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
// test route
router.get('/', (req, res) => {
    const response = { message: '' };
    response.message = 'Exclusive api';
    res.json(response);
});
app.use('/api/v1/auth', authentication_1.default);
app.use('/api/v1/product', products_1.default);
app.use('/api/v1/cart', cart_1.default);
app.use('/api/v1/order', orders_1.default);
// start the server
// app.listen(port);
app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
