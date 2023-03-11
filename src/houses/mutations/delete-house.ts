import { RequestHandler } from 'express';
import UserModel from 'models/user-model';
import ErrorService, { ForbiddenError, ServerSetupError } from 'services/error-service';
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
    if (req.authData === undefined) throw new ServerSetupError();

    const user = await UserModel.getUserByEmail(req.authData.email);
    const house = await HousesModel.getHouse(id);
    if (user.role !== 'ADMIN' && user.id !== house.owner.id) throw new ForbiddenError();

    await HousesModel.deleteHouse(id);
    res.status(200).json(house);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
