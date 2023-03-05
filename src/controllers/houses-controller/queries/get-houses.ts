import { RequestHandler } from 'express';
import HouseService from '../../../services/houses-service';

import { HouseModel } from '../types';

export const getHouses: RequestHandler<
  {},
  HouseModel[],
  {},
  {}
> = async (req, res) => {
  const houses = await HouseService.getHouses();

  res.status(200).json(houses);
};
