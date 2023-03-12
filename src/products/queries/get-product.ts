import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import ProductsModel from '../model';
import { ProductViewModel } from '../types';

export const getProduct: RequestHandler<
  { id: string | undefined },
  ProductViewModel | ErrorResponse,
  {},
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    const product = await ProductsModel.getProduct(id);

    res.status(200).json(product);
  } catch (error) {
    const [status, errorResponse] = ErrorService.handleError(error);
    res.status(status).json(errorResponse);
  }
};
