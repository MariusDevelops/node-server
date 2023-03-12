import { RequestHandler } from 'express';
import UserModel from 'models/user-model';
import ErrorService, { ServerSetupError } from 'services/error-service';
import ProductsModel from '../model';
import { ProductViewModel, PartialProductBody } from '../types';
import productDataValidationSchema from '../validation-schemas/product-data-validation-schema';

export const createProduct: RequestHandler<
  {},
  ProductViewModel | ErrorResponse,
  PartialProductBody,
  {}
> = async (req, res) => {
  try {
    const productData = productDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    if (req.authData === undefined) throw new ServerSetupError();
    const user = await UserModel.getUserByEmail(req.authData.email);

    const createdProduct = await ProductsModel.createProduct({ ...productData, ownerId: user.id });

    res.status(201).json(createdProduct);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
