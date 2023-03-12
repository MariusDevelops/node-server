import { getProduct } from './get-product';
import { getProducts } from './get-products';
import { createProduct } from './create-product';
import { updateProduct } from './update-product';
import { deleteProduct } from './delete-product';

const ProductsModel = {
  getProduct,
  getProducts,

  createProduct,
  updateProduct,
  deleteProduct,
};

export default ProductsModel;
