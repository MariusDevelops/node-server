import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import { HouseModel, PartialHouseData } from '../types';
import houses from '../houses-data';
import partialHouseDataValidationSchema from '../validation-schemas/partial-house-data-validation-schema';

export const updateHouse: RequestHandler<
  { id: string | undefined },
  HouseModel | ResponseError,
  PartialHouseData,
  {}
> = (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server setup error' });
    return;
  }

  const foundHouseIndex = houses.findIndex((house) => house.id === id);

  if (foundHouseIndex === -1) {
    res.status(400).json({ error: `house was not found with id '${id}'` });
    return;
  }

  try {
    const partialHouseData = partialHouseDataValidationSchema.validateSync(
      req.body,
      { abortEarly: false },
    );
    const foundHouse = houses[foundHouseIndex];

    const updatedHouse = {
      ...foundHouse,
      ...partialHouseData,
    };

    houses.splice(foundHouseIndex, 1, updatedHouse);

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
