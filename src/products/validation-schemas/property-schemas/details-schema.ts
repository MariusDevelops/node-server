import * as yup from 'yup';

const detailsSchema = yup
  .object({
    material: yup.string()
      .required('details.material is required')
      .min(2, 'details.material must have at least 2 symbols')
      .max(32, 'details.material can\'t have more than 32 symbols'),
    sizes: yup.string()
      .required('details.sizes is required')
      .min(2, 'details.sizes must have at least 2 symbols')
      .max(32, 'details.sizes can\'t have more than 32 symbols'),
  });

export default detailsSchema;
