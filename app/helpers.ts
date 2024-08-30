import aws from 'aws-sdk';
import fs from 'fs';
import { constants } from '../config/constants';
import { PoolClient } from 'pg';

function getSchemaName() {
  return process.env.DATABASE_SCHEMA || constants.database.SCHEMA_NAME;
}

// String.prototype.replaceAll = function (target: string, replacement: string) {
//   return this.split(target).join(replacement);
// };

export function clientClose(client: PoolClient | null) {
  if (client !== null && client !== undefined) {
    client.release(true);
  }
}

// replaceAll part of es2021
export function replaceSchema(sql: string): string {
  return sql.replaceAll('$$SCHEMANAME$$', getSchemaName());
}

export function setUserInfo(request: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}): { id: string; first_name: string; last_name: string; email: string } {
  const getUserInfo = {
    id: request.id,
    first_name: request.firstName,
    last_name: request.lastName,
    email: request.email
  };
  return getUserInfo;
}

// export function uploadImageToAws_old(files, filePath, cb) {
//   aws.config.update({
//     // Your SECRET ACCESS KEY from AWS should go here,
//     // Never share it!
//     // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
//     secretAccessKey: '',
//     // Not working key, Your ACCESS KEY ID from AWS should go here,
//     // Never share it!
//     // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
//     accessKeyId: '',
//     region: 'us-east-1' // region of your bucket
//   });
//   const s3 = new aws.S3();
//   const path = require('path');
//   const params = {
//     Bucket: 'exclusive',
//     Key: `product/${files.product_image.name}`,
//     ACL: 'public-read',
//     Body: 'http://localhost:3000//uploads/product/item3.jpg'
//   };
//   console.log(filePath);
//   s3.upload(params, (perr, pres) => {
//     if (perr) {
//       cb(perr);
//       console.log('Error uploading data: ', perr);
//     } else {
//       cb(null);
//       // here delete image from local server after successfully load to s3
//       console.log('Successfully uploaded data to myBucket/myKey');
//     }
//   });
// }

export function uploadImageToAws(
  files: { product_image: { type: string } },
  filePath: string,
  cb: (err: Error | null) => void
): void {
  aws.config.update({
    secretAccessKey: '',
    accessKeyId: '',
    region: 'us-east-1'
  });
  const s3: aws.S3 = new aws.S3();
  const fileStream: fs.ReadStream = fs.createReadStream(filePath);
  fileStream.on('error', (err: Error) => {
    console.log('File Error', err);
    cb(err);
  });
  const path = require('path');
  const params: aws.S3.PutObjectRequest = {
    Bucket: 'tilesonweb',
    Key: `product/${path.basename(filePath)}`,
    Body: fileStream,
    ContentType: files.product_image.type
  };
  s3.upload(params, (err: Error, data: aws.S3.ManagedUpload.SendData) => {
    if (err) {
      cb(err);
      console.log('Error', err);
    }
    if (data) {
      cb(null);
      console.log('Upload Success', data.Location);
    }
  });
}
