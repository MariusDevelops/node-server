import * as yup from 'yup';
import { ProductBody } from '../types';
import imagesSchema from './property-schemas/images-schema';
import detailsSchema from './property-schemas/details-schema';
import priceSchema from './property-schemas/price-schema';
import ratingSchema from './property-schemas/rating-schema';
import titleSchema from './property-schemas/title-schema';

const productDataValidationSchema: yup.ObjectSchema<ProductBody> = yup.object({
  title: titleSchema.required('title is required'),
  price: priceSchema(true),
  rating: ratingSchema.required('rating is required'),
  images: imagesSchema.required('images are required'),
  details: detailsSchema.required('details is required'),
}).strict(true);

export default productDataValidationSchema;
