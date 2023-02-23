import * as yup from 'yup';
import { HouseData } from '../types';
import imagesSchema from './images-schema';
import locationSchema from './location-schema';
import priceSchema from './price-schema';
import ratingSchema from './rating-schema';
import titleSchema from './title-schema';

const houseDataValidationSchema: yup.ObjectSchema<HouseData> = yup.object({
  title: titleSchema.required('title is required'),
  price: priceSchema(true),
  rating: ratingSchema.required('rating is required'),
  images: imagesSchema.required('images are required'),
  location: locationSchema.required('location is required'),
}).strict(true);

export default houseDataValidationSchema;
