import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import HousesModel from '../model';
import { HouseViewModel } from '../types';

export const getHouse: RequestHandler<
  { id: string | undefined },
  HouseViewModel | ErrorResponse,
  {},
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    const house = await HousesModel.getHouse(id);

    res.status(200).json(house);
  } catch (error) {
    const [status, errorResponse] = ErrorService.handleError(error);
    res.status(status).json(errorResponse);
  }
};
