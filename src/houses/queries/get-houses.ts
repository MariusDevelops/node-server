import { RequestHandler } from 'express';
import ErrorService from 'services/error-service';
import HousesModel from '../model';

import { HouseViewModel } from '../types';

export const getHouses: RequestHandler<
  {},
  HouseViewModel[] | ErrorResponse,
  {},
  {}
> = async (req, res) => {
  try {
    const houses = await HousesModel.getHouses();
    res.status(200).json(houses);
  } catch (error) {
    const [status, errorResponse] = ErrorService.handleError(error);
    res.status(status).json(errorResponse);
  }
};
