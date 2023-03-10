import { RequestHandler } from 'express';
import ErrorService from 'services/error-service';
import HousesModel from '../model';
import { HouseViewModel, PartialHouseData } from '../types';
import houseDataValidationSchema from '../validation-schemas/house-data-validation-schema';

export const createHouse: RequestHandler<
  {},
  HouseViewModel | ErrorResponse,
  PartialHouseData,
  {}
> = async (req, res) => {
  try {
    const houseData = houseDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const createdHouse = await HousesModel.createHouse(houseData);

    res.status(201).json(createdHouse);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
