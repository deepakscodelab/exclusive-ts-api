import { ValidationError } from 'express-validator';

export interface CreateProductResponse {
  msg?: string;
  errors?: ValidationError;
}

// export interface ValidationError {
//   value: any;
//   msg: string;
//   param: string;
//   location: 'body' | 'query' | 'params' | 'headers' | 'cookies';
//   nestedErrors?: ValidationError[]; // For nested validation
// }
