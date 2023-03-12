import express, { RequestHandler } from 'express';
import authMiddleware from 'middlewares/auth-middleware';
import { getProduct } from './queries/get-product';
import { getProducts } from './queries/get-products';
import { createProduct } from './mutations/create-product';
import { updateProduct } from './mutations/update-product';
import { deleteProduct } from './mutations/delete-product';

const productsRouter = express.Router();

productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProduct);

productsRouter.post('/', authMiddleware, createProduct);
productsRouter.patch('/:id', authMiddleware, updateProduct as RequestHandler);
productsRouter.delete('/:id', authMiddleware, deleteProduct as RequestHandler);

export default productsRouter;
