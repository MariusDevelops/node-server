import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import createId from 'uniqid';
import { HouseModel, HouseData } from '../types';
import houses from '../houses-data';
import houseDataValidationSchema from '../validation-schemas/house-data-validation-schema';

export const createHouse: RequestHandler<
  {},
  HouseModel | ResponseError,
  HouseData,
  {}
> = (req, res) => {
  try {
    const houseData = houseDataValidationSchema.validateSync(req.body, { abortEarly: false });
    const newHouse: HouseModel = { id: createId(), ...houseData };
    houses.push(newHouse);

    res.status(201).json(newHouse);
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
