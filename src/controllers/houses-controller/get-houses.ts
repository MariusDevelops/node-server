import { RequestHandler } from 'express';
import HouseModel from './house-model';
import houses from './houses-data';

export const getHouses: RequestHandler<
  {},
  HouseModel[],
  {},
  {}
> = (req, res) => {
  res.status(200).json(houses);
};
