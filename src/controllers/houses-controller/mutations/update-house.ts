import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import HouseService from '../../../services/houses-service';
import { HouseModel, PartialHouseData } from '../types';
import partialHouseDataValidationSchema from '../validation-schemas/partial-house-data-validation-schema';

export const updateHouse: RequestHandler<
  { id: string | undefined },
  HouseModel | ErrorResponse,
  PartialHouseData,
  {}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server setup error' });
    return;
  }

  try {
    const partialHouseData = partialHouseDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );

    const updatedHouse = await HouseService.updateHouse(id, partialHouseData);
    res.status(200).json(updatedHouse);
  } catch (err) {
    if (err instanceof ValidationError) {
      const manyErrors = err.errors.length > 1;
      res.status(400).json({
        error: manyErrors ? 'Validation errors' : err.errors[0],
        errors: manyErrors ? err.errors : undefined,
      });
    } else if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
