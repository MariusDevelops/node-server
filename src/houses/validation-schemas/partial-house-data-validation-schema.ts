import * as yup from 'yup';
import { PartialHouseBody } from '../types';
import imagesSchema from './property-schemas/images-schema';
import locationSchema from './property-schemas/location-schema';
import priceSchema from './property-schemas/price-schema';
import ratingSchema from './property-schemas/rating-schema';
import titleSchema from './property-schemas/title-schema';

const partialHouseDataValidationSchema: yup.ObjectSchema<PartialHouseBody> = yup.object({
  title: titleSchema,
  price: priceSchema(),
  rating: ratingSchema,
  images: imagesSchema,
  location: locationSchema,
}).strict(true);

export default partialHouseDataValidationSchema;
