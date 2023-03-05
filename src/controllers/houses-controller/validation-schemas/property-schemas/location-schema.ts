import * as yup from 'yup';

const locationSchema = yup
  .object({
    country: yup.string()
      .required('location.country is required')
      .min(2, 'location.country must have at least 2 symbols')
      .max(32, 'location.country can\'t have more than 32 symbols'),
    city: yup.string()
      .required('location.city is required')
      .min(2, 'location.city must have at least 2 symbols')
      .max(32, 'location.city can\'t have more than 32 symbols'),
  });

export default locationSchema;
