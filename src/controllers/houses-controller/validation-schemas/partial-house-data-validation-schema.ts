import * as yup from 'yup';
import { PartialHouseData } from '../types';

const partialHouseDataValidationSchema: yup.ObjectSchema<PartialHouseData> = yup.object({
  title: yup.string()
    .min(2, 'title must have at least 2 symbols')
    .max(32, 'title can\'t have more than 32 symbols'),

  price: yup.number()
    .positive('price must be positive')
    .test(
      'isPrice',
      'icorrect price format',
      (val) => {
        if (val === undefined) return true;
        return Number(val.toFixed(2)) === val;
      },
    ),

  rating: yup.number()
    .positive('rating must be positive')
    .min(1, 'rating must be at least 1')
    .max(5, 'rating cant\'t be more than 5'),

  images: yup.array(yup.string().required())
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
    }),
}).strict(true);

export default partialHouseDataValidationSchema;
