import { RequestHandler } from 'express';
import HouseService from '../../../services/houses-service';
import { HouseModel } from '../types';

export const getHouse: RequestHandler<
  { id: string | undefined },
  HouseModel | ErrorResponse,
  {},
  {}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server setup error' });
    return;
  }

  try {
    const house = await HouseService.getHouse(id);
    res.status(200).json(house);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'request error';
    res.status(404).json({ error: message });
  }
};
