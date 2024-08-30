"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientClose = clientClose;
exports.replaceSchema = replaceSchema;
exports.setUserInfo = setUserInfo;
exports.uploadImageToAws = uploadImageToAws;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("../config/constants");
function getSchemaName() {
    return process.env.DATABASE_SCHEMA || constants_1.constants.database.SCHEMA_NAME;
}
// String.prototype.replaceAll = function (target: string, replacement: string) {
//   return this.split(target).join(replacement);
// };
function clientClose(client) {
    if (client !== null && client !== undefined) {
        client.release(true);
    }
}
// replaceAll part of es2021
function replaceSchema(sql) {
    return sql.replaceAll('$$SCHEMANAME$$', getSchemaName());
}
function setUserInfo(request) {
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
function uploadImageToAws(files, filePath, cb) {
    aws_sdk_1.default.config.update({
        secretAccessKey: '',
        accessKeyId: '',
        region: 'us-east-1'
    });
    const s3 = new aws_sdk_1.default.S3();
    const fileStream = fs_1.default.createReadStream(filePath);
    fileStream.on('error', (err) => {
        console.log('File Error', err);
        cb(err);
    });
    const path = require('path');
    const params = {
        Bucket: 'tilesonweb',
        Key: `product/${path.basename(filePath)}`,
        Body: fileStream,
        ContentType: files.product_image.type
    };
    s3.upload(params, (err, data) => {
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
