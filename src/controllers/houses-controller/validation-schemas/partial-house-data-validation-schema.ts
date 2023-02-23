import * as yup from 'yup';
import { PartialHouseData } from '../types';
import imagesSchema from './images-schema';
import locationSchema from './location-schema';
import priceSchema from './price-schema';
import ratingSchema from './rating-schema';
import titleSchema from './title-schema';

const partialHouseDataValidationSchema: yup.ObjectSchema<PartialHouseData> = yup.object({
  title: titleSchema,
  price: priceSchema(),
  rating: ratingSchema,
  images: imagesSchema,
  location: locationSchema,
}).strict(true);

export default partialHouseDataValidationSchema;
