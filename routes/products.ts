import express, { Request, Response, Router } from 'express';

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import pool from '../app/db';

import { clientClose, uploadImageToAws } from '../app/helpers';
import Product from '../libraries/classProduct';
import Common from '../libraries/classCommon';
import { PoolClient } from 'pg';

const router: Router = express.Router();

router.get('/', (req, res) => {
  const response: { message: string } = { message: '' };
  response.message = 'Product list';

  res.status(200).send(response);
});

router.post('/addProduct', (req, res) => {
  (async () => {
    let client = null;
    const userid = 1;
    try {
      client = await pool.connect();
      const productdata = req.body;
      // replace this aws S3 bucket
      const products = await Product.saveProduct(client, productdata);
      if (products) {
        res.status(200).json({
          msg: 'product added successfully'
        });
      } else {
        res.status(404).send('user not exits');
      }
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).send();
      clientClose(client);
    }
  })();
});

// router.post('/addProductwithawss3', async (req: Request, res: Response) => {
//   let client = null;
//   const userid = 1;
//   try {
//     client = await pool.connect();

//     const form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return res.status(400).send('Error parsing the files');
//       }

//       const oldpath = files.product_image.path;
//       const newpath = `${path.join(__dirname, '..')}/public/uploads/product/${
//         files.product_image.name
//       }`;
//       fields.product_image = files.product_image.name;

//       fs.rename(oldpath, newpath, async (err) => {
//         if (err) {
//           return res.status(500).send('Error moving the file');
//         }

//         try {
//           await uploadImageToAws(files, newpath);
//           const products = await Product.saveProduct(client, fields);
//           if (products) {
//             res.status(200).json({
//               msg: 'product added successfully'
//             });
//           } else {
//             res.status(404).send('Oops something went wrong');
//           }
//         } catch (error) {
//           console.error(error);
//           res.status(500).send();
//         }
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send();
//   } finally {
//     if (client) {
//       client.release();
//     }
//   }
// });

router.get('/productList', (req, res) => {
  (async () => {
    let client = null;
    const table = '$$SCHEMANAME$$.products';
    try {
      // console.log("1212121");
      client = await pool.connect();
      // console.log("here");
      const products = await Common.findAll(client, table);
      // console.log(products);
      res.status(200).send({
        token: 'JWT',
        products
      });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).send();
      clientClose(client);
    }
  })();
});

router.get('/productDetails/:product_id', (req, res) => {
  (async () => {
    let client = null;
    const { product_id } = req.params;
    const table = '$$SCHEMANAME$$.products';
    try {
      client = await pool.connect();
      const product = await Common.findById(client, table, product_id);
      if (product !== null) {
        res.status(200).send({
          token: 'JWT',
          product
        });
      } else {
        res.status(404).send('product not exits');
      }
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).send();
      clientClose(client);
    }
  })();
});

// router.post('/addToCart', (req, res) => {
//   const postData = req.body;
//   (async () => {
//     let client = null;
//     try {
//       client = await pool.connect();
//       const productdata = await Product.addToCart(client, postData);
//       if (cart !== null) {
//         res.status(200).json({
//           cartItems: productdata
//         });
//       } else {
//         res.status(404).send('Not able to add cart');
//       }
//       client.release();
//     } catch (error) {
//       console.log(error);
//       res.status(500).send();
//       clientClose(client);
//     }
//   })();
// });

// router.get('/cartItems', (req, res) => {
//   const postData = req.body;
//   const user_id = 1;
//   (async () => {
//     let client = null;
//     try {
//       client = await pool.connect();
//       const allCartItems = await Product.userCartItems(client, user_id);
//       if (allCartItems !== null) {
//         res.status(200).json({
//           cartItems: allCartItems
//         });
//       } else {
//         res.status(404).send('Not able to find cart');
//       }
//       client.release();
//     } catch (error) {
//       console.log(error);
//       res.status(500).send();
//       clientClose(client);
//     }
//   })();
// });

// router.post('/removeFromCart', (req, res) => {
//   const postData = req.body;
//   const user_id = 1;
//   (async () => {
//     let client = null;
//     try {
//       client = await pool.connect();
//       const allCartItems = await Product.removeFromCart(
//         client,
//         postData,
//         user_id
//       );
//       if (allCartItems !== null) {
//         res.status(200).json({
//           cartItems: allCartItems
//         });
//       } else {
//         res.status(404).send('Not able to find cart');
//       }
//       client.release();
//     } catch (error) {
//       console.log(error);
//       res.status(500).send();
//       clientClose(client);
//     }
//   })();
// });

router.put('/updateItemQty/:product_id', (req, res) => {
  const { type } = req.body;
  const { product_id } = req.params;
  (async () => {
    let client = null;
    try {
      client = await pool.connect();
      const allCartItems = await Product.updateItemQty(
        client,
        product_id,
        type
      );
      if (allCartItems !== null) {
        res.status(200).json({
          cartItems: allCartItems
        });
      } else {
        res.status(404).send('Not able to find cart');
      }
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).send();
      clientClose(client);
    }
  })();
});

/*
router.get("/productList", async function(req, res) {
  (async () => {
    let client = null;
    try {
      client = await pool.connect();
      const products = await Product.findAll(client, (userid = 1));
      //console.log(products);
      if (products !== null) {
        res.status(200).send({
          token: `JWT`,
          products
        });
      } else {
        res.status(404).send("products not exits");
      }
      client.release();
    } catch (error) {
      res.status(500).send();
      clientClose(client);
    }
  })();
});
*/

/*
router.get("/productList", async function(req, res) {
  let client = null;
  console.log("productList");
  try {
    client = await pool.connect();
    console.log(product);
    const products = await product.findAll(client, (userid = 1));
    console.log(products);
    if (products !== null) {
      res.status(200).send({
        token: `JWT`,
        products
      });
    } else {
      res.status(404).send("products not exits");
    }
    client.release();
  } catch (error) {
    res.status(500).send();
    clientClose(client);
  }
});
*/

export default router;
