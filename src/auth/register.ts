import { RequestHandler } from 'express';
import ErrorService from 'services/error-service';
import { AuthSuccessResponse, RegistrationData } from './types';
import registrationDataValidationSchema from './validation-schemas/registration-data-validation-schema';

export const register: RequestHandler<
  {},
  AuthSuccessResponse | ErrorResponse,
  Partial<RegistrationData>,
  {}
> = async (req, res) => {
  try {
    const registrationData = registrationDataValidationSchema.validateSync(req.body, {
      abortEarly: false,
    });

    res.status(200).json(registrationData as unknown as AuthSuccessResponse);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
