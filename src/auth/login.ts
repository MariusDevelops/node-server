import { RequestHandler } from 'express';
import ErrorService from 'services/error-service';
import { CredentialPartial, AuthSuccessResponse } from './types';
import credentialsValidationSchema from './validation-schemas/credentials-validation-schema';

export const login: RequestHandler<
  {},
  AuthSuccessResponse | ErrorResponse,
  CredentialPartial,
  {}

> = (req, res) => {
  try {
    const credentials = credentialsValidationSchema.validateSync(req.body, { abortEarly: false });

    res.status(200).json(credentials as unknown as AuthSuccessResponse);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
  /*
    // 1. Sukurti validacijos schemą, kuri patikrintų ar <credentials> yra teisingi
    //   * ne - grąžinti klaidą
    2. Sukurti duomenų bazėje migraciją, kuri sukuria vartotojų lentelę <users>
      * id
      * email
      * password
      * name
      * surname
      * role: 'ADMIN' | 'USER'
      * createdAt
      * updatedAt
    3. Sukurti duomenų bazėje migraciją, kuri įrašo pirmajį admin vartotoją
      * email - admin@gmail.com
      * password - Vilnius123!
    4. Tikrinti ar <credentials> atitikmuo yra duomenų bazėje
      * taip - suformuoti dirbtinius user duomenis
      * ne - grąžinti klaidą
    5. Sukurti tokeną. - https://www.npmjs.com/package/jsonwebtoken
    6. Suformuoti užklausos atsakymą.
    7. Įgalinti šifruoto password saugojimą duomenų bazėje.
      Ir patobulinti tikrinimą password sutapimą - https://www.npmjs.com/package/bcrypt?activeTab=readme
  */
};