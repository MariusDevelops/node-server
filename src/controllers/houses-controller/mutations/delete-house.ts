import { RequestHandler } from 'express';
import HouseService from '../../../services/houses-service';
import { HouseModel } from '../types';

export const deleteHouse: RequestHandler<
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
    await HouseService.deleteHouse(id);

    res.status(200).json(house);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
