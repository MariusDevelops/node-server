import { RequestHandler } from 'express';
import UserModel from 'models/user-model';
import ErrorService, { ForbiddenError, ServerSetupError } from 'services/error-service';
import HousesModel from '../model';
import { HouseViewModel, PartialHouseBody } from '../types';
import partialHouseDataValidationSchema from '../validation-schemas/partial-house-data-validation-schema';

export const updateHouse: RequestHandler<
  { id: string | undefined },
  HouseViewModel | ErrorResponse,
  PartialHouseBody,
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    if (req.authData === undefined) throw new ServerSetupError();
    const partialHouseData = partialHouseDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const user = await UserModel.getUserByEmail(req.authData.email);
    const house = await HousesModel.getHouse(id);
    if (user.role !== 'ADMIN' && user.id !== house.owner.id) throw new ForbiddenError();

    const updatedHouse = await HousesModel.updateHouse(id, partialHouseData);
    res.status(200).json(updatedHouse);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
