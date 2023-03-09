import { RequestHandler } from 'express';
import ErrorService from 'services/error-service';
import { AuthSuccessResponse, RegistrationData } from './types';
import registrationDataValidationSchema from './validation-schemas/registration-data-validation-schema';
import UserModel from './model';

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

    // TODO: patikrinti ar paštas yra lasivas - galimas.

    const user = await UserModel.createUser({
      email: registrationData.email,
      password: registrationData.password, // TODO: užšifruoti
      name: registrationData.name,
      surname: registrationData.surname,
    });

    /*
      // 1. Sukurti vartotoją
      //   * pradžioje išsibandome MySql Workbench'e
      //   * sukuriame modelio metodą - createUser
      2. Sukurti tokeną
        * sukurti atskirą service'ą kurti ir dekoduoti token'ui
        * aprašyti jame metodą - createToken
        * panaudoti jį tam, kad sukurti token'ą register/login metoduose
      3. išsiųsti duomenis - AuthSuccessResponse
        * sukuriame helper'į - createAuthSuccessResponse(user)
          * token'o sukūrimas perkelimas į funkcijos vidų
        * pritaikome createAuthSuccessResponse register/login metoduose
        * siunčiame duomenis naudodami <res> objektą
    */

    res.status(200).json(user as unknown as AuthSuccessResponse);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
