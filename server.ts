import express, { NextFunction, Request, Response, Router } from 'express';
import bodyParser from 'body-parser';

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Import the swagger configuration

// Register the routes
import routeAuth from './routes/authentication';
import routeProducts from './routes/products';
import routeCart from './routes/cart';
import routeOrders from './routes/orders';

const app = express();

// Routes for APIs
const router: Router = express.Router();
const env = process.env.NODE_ENV || 'development';
app.set('port', process.env.PORT || 3000);

if (env === 'production') {
  // app.use(forceSsl);
}

// Swagger setup

// CDN CSS
const CSS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

// const JS_URL = [
//   './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
//   './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js'
// ];

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL
  })
  // swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL, customJs: JS_URL })
);

// till here

app.get('/', (req, res) => {
  res.send('Welcome to exclusive app API');
});

app.use('/api', router);
// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.disable('x-powered-by');

// Enable CORS from client-side
app.use((req: Request, res: Response, next: NextFunction) => {
  const originUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://tilesonweb.herokuapp.com'
      : 'http://localhost:8080';
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// test route

router.get('/', (req: Request, res: Response) => {
  const response: { message: string } = { message: '' };
  response.message = 'Exclusive api';
  res.json(response);
});

app.use('/api/v1/auth', routeAuth);
app.use('/api/v1/product', routeProducts);
app.use('/api/v1/cart', routeCart);
app.use('/api/v1/order', routeOrders);

// start the server
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
