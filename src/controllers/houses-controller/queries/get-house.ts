import { RequestHandler } from 'express';
import { HouseModel } from '../types';
import houses from '../houses-data';

export const getHouse: RequestHandler<
  { id: string | undefined },
  HouseModel | ResponseError,
  {},
  {}
> = (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server setup error' });
    return;
  }

  const foundHouse = houses.find((house) => house.id === id);

  if (foundHouse === undefined) {
    res.status(400).json({ error: `house was not found with id '${id}'` });
    return;
  }

  res.status(200).json(foundHouse);
};
