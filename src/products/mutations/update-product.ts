import { RequestHandler } from 'express';
import UserModel from 'models/user-model';
import ErrorService, { ForbiddenError, ServerSetupError } from 'services/error-service';
import ProductsModel from '../model';
import { ProductViewModel, PartialProductBody } from '../types';
import partialProductDataValidationSchema from '../validation-schemas/partial-product-data-validation-schema';

export const updateProduct: RequestHandler<
  { id: string | undefined },
  ProductViewModel | ErrorResponse,
  PartialProductBody,
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    if (req.authData === undefined) throw new ServerSetupError();
    const partialProductData = partialProductDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const user = await UserModel.getUserByEmail(req.authData.email);
    const product = await ProductsModel.getProduct(id);
    if (user.role !== 'ADMIN' && user.id !== product.owner.id) throw new ForbiddenError();

    const updatedProduct = await ProductsModel.updateProduct(id, partialProductData);
    res.status(200).json(updatedProduct);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
