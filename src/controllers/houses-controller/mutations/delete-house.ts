import { RequestHandler } from 'express';
import { HouseModel } from '../types';
import houses from '../houses-data';

export const deleteHouse: RequestHandler<
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

  const foundHouseIndex = houses.findIndex((house) => house.id === id);

  if (foundHouseIndex === -1) {
    res.status(400).json({ error: `house was not found with id '${id}'` });
    return;
  }

  const [deletedHoouse] = houses.splice(foundHouseIndex, 1);

  res.status(200).json(deletedHoouse);
};
