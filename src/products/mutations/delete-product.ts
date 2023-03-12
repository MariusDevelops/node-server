import { RequestHandler } from 'express';
import UserModel from 'models/user-model';
import ErrorService, { ForbiddenError, ServerSetupError } from 'services/error-service';
import ProductsModel from '../model';
import { ProductViewModel } from '../types';

export const deleteProduct: RequestHandler<
  { id: string | undefined },
  ProductViewModel | ErrorResponse,
  {},
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    if (req.authData === undefined) throw new ServerSetupError();

    const user = await UserModel.getUserByEmail(req.authData.email);
    const product = await ProductsModel.getProduct(id);
    if (user.role !== 'ADMIN' && user.id !== product.owner.id) throw new ForbiddenError();

    await ProductsModel.deleteProduct(id);
    res.status(200).json(product);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
