import * as yup from 'yup';
import { HouseData } from '../types';

const houseDataValidationSchema: yup.ObjectSchema<HouseData> = yup.object({
  title: yup.string()
    .required('title is required')
    .min(2, 'title must have at least 2 symbols')
    .max(32, 'title can\'t have more than 32 symbols'),

  price: yup.number()
    .required('price is required')
    .positive('price must be positive')
    .test(
      'isPrice',
      'icorrect price format',
      (val) => Number(val.toFixed(2)) === val,
    ),

  rating: yup.number()
    .required('rating is required')
    .positive('rating must be positive')
    .min(1, 'rating must be at least 1')
    .max(5, 'rating cant\'t be more than 5'),

  images: yup.array(yup.string().required())
    .required('images are required')
    .min(1, 'images must have at least one image'),

  location: yup
    .object({
      country: yup.string()
        .required('location.title is required')
        .min(2, 'location.title must have at least 2 symbols')
        .max(32, 'location.title can\'t have more than 32 symbols'),
      city: yup.string()
        .required('location.city is required')
        .min(2, 'location.city must have at least 2 symbols')
        .max(32, 'location.city can\'t have more than 32 symbols'),
    })
    .required('location is required'),
}).strict(true);

export default houseDataValidationSchema;
