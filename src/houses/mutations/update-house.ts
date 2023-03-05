import { RequestHandler } from 'express';
import ErrorService, { ServerSetupError } from 'services/error-service';
import HousesModel from '../model';
import { HouseViewModel, PartialHouseData } from '../types';
import partialHouseDataValidationSchema from '../validation-schemas/partial-house-data-validation-schema';

export const updateHouse: RequestHandler<
  { id: string | undefined },
  HouseViewModel | ErrorResponse,
  PartialHouseData,
  {}
> = async (req, res) => {
  const { id } = req.params;

  try {
    if (id === undefined) throw new ServerSetupError();
    const partialHouseData = partialHouseDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const updatedHouse = await HousesModel.updateHouse(id, partialHouseData);
    res.status(200).json(updatedHouse);
  } catch (err) {
    const [status, errorResponse] = ErrorService.handleError(err);
    res.status(status).json(errorResponse);
  }
};
