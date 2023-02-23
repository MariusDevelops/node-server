import * as yup from 'yup';

const ratingSchema = yup.number()
  .positive('rating must be positive')
  .min(1, 'rating must be at least 1')
  .max(5, 'rating cant\'t be more than 5');

export default ratingSchema;
