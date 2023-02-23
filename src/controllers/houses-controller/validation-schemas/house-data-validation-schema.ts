import * as yup from 'yup';
import { HouseData } from '../types';
import imagesSchema from './property-schemas/images-schema';
import locationSchema from './property-schemas/location-schema';
import priceSchema from './property-schemas/price-schema';
import ratingSchema from './property-schemas/rating-schema';
import titleSchema from './property-schemas/title-schema';

const houseDataValidationSchema: yup.ObjectSchema<HouseData> = yup.object({
  title: titleSchema.required('title is required'),
  price: priceSchema(true),
  rating: ratingSchema.required('rating is required'),
  images: imagesSchema.required('images are required'),
  location: locationSchema.required('location is required'),
}).strict(true);

export default houseDataValidationSchema;
