import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import HousesModel from '../model';
import { HouseViewModel } from '../types';

export const deleteHouse: RequestHandler<
  { id: string | undefined },
  HouseViewModel | ErrorResponse,
  {},
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    const house = await HousesModel.getHouse(id);
    await HousesModel.deleteHouse(id);

    res.status(200).json(house);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
