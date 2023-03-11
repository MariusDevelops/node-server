import { RequestHandler } from 'express';
import UserModel from 'models/user-model';
import ErrorService, { ServerSetupError } from 'services/error-service';
import HousesModel from '../model';
import { HouseViewModel, PartialHouseBody } from '../types';
import houseDataValidationSchema from '../validation-schemas/house-data-validation-schema';

export const createHouse: RequestHandler<
  {},
  HouseViewModel | ErrorResponse,
  PartialHouseBody,
  {}
> = async (req, res) => {
  try {
    const houseData = houseDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    if (req.authData === undefined) throw new ServerSetupError();
    const user = await UserModel.getUserByEmail(req.authData.email);

    const createdHouse = await HousesModel.createHouse({ ...houseData, ownerId: user.id });

    res.status(201).json(createdHouse);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
