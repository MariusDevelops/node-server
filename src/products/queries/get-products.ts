import { RequestHandler } from 'express';
import ErrorService from 'services/error-service';
import ProductsModel from '../model';

import { ProductViewModel } from '../types';

export const getProducts: RequestHandler<
  {},
  ProductViewModel[] | ErrorResponse,
  {},
  {}
> = async (req, res) => {
  try {
    const products = await ProductsModel.getProducts();
    res.status(200).json(products);
  } catch (error) {
    const [status, errorResponse] = ErrorService.handleError(error);
    res.status(status).json(errorResponse);
  }
};
