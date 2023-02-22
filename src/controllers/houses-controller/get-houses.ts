import { RequestHandler } from 'express';
import { HouseModel } from './types';
import houses from './houses-data';

export const getHouses: RequestHandler<
  {},
  HouseModel[],
  {},
  {}
> = (req, res) => {
  res.status(200).json(houses);
};
