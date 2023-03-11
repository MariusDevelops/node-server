import * as yup from 'yup';
import { RegistrationBody } from '../types';

const registrationDataValidationSchema: yup.ObjectSchema<RegistrationBody> = yup.object({
  email: yup.string()
    .required('email is required')
    .email('incorrect email format'),

  password: yup.string()
    .required('password is required')
    .min(2, 'password must have at least 2 symbols')
    .max(32, 'password can\'t have more than 32 symbols')
    .matches(/[A-Z]{1}/, 'password must have at least one upper case letter')
    .matches(/[a-z]{1}/, 'password must have at least one lower case letter')
    .matches(/[0-9]{1}/, 'password must have at least one number')
    .matches(/[#?!@$%^&*-]{1}/, 'password must have at least special character'),

  passwordConfirmation: yup.string()
    .required('password must be confirmed')
    .oneOf([yup.ref('password')], 'passowords must match'),

  name: yup.string()
    .required('name is required')
    .min(2, 'name must have at least 2 symbols')
    .max(32, 'name can\'t have more than 32 symbols'),

  surname: yup.string()
    .required('surname is required')
    .min(2, 'surname must have at least 2 symbols')
    .max(32, 'surname can\'t have more than 32 symbols'),

  mobile: yup.string()
    .required('mobile is required')
    .min(9, 'mobile must have at least 2 symbols')
    .max(16, 'mobile can\'t have more than 32 symbols'),

}).strict(true);

export default registrationDataValidationSchema;
