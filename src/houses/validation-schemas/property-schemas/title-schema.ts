import * as yup from 'yup';

const titleSchema = yup.string()
  .min(2, 'title must have at least 2 symbols')
  .max(32, 'title can\'t have more than 32 symbols');

export default titleSchema;
