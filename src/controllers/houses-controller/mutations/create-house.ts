import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import HouseService from '../../../services/houses-service';
import { HouseModel, HouseData } from '../types';
import houseDataValidationSchema from '../validation-schemas/house-data-validation-schema';

export const createHouse: RequestHandler<
  {},
  HouseModel | ErrorResponse,
  HouseData,
  {}
> = async (req, res) => {
  try {
    const houseData: HouseData = houseDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const createdHouse = await HouseService.createHouse(houseData);

    res.status(201).json(createdHouse);
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
