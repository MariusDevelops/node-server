import * as yup from 'yup';
import { PartialProductBody } from '../types';
import imagesSchema from './property-schemas/images-schema';
import detailsSchema from './property-schemas/details-schema';
import priceSchema from './property-schemas/price-schema';
import ratingSchema from './property-schemas/rating-schema';
import titleSchema from './property-schemas/title-schema';

const partialProductDataValidationSchema: yup.ObjectSchema<PartialProductBody> = yup.object({
  title: titleSchema,
  price: priceSchema(),
  rating: ratingSchema,
  images: imagesSchema,
  details: detailsSchema,
}).strict(true);

export default partialProductDataValidationSchema;
