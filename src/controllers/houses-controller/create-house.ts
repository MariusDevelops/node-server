import { RequestHandler } from 'express';
import HouseModel from './house-model';
import houses from './houses-data';

const isHouseData = (
  potentialHouseData: PartialHouseData | HouseData,
): potentialHouseData is HouseData => {
  const {
    title, price, rating, images, location,
  } = potentialHouseData;

  if (typeof title !== 'string') return false;
  if (typeof price !== 'string') return false;
  if (typeof rating !== 'number') return false;
  if (!Array.isArray(images)) return false;
  if (images.some((img) => typeof img !== 'string')) return false;
  if (location === null || typeof location !== 'object') return false;
  if (typeof location.city !== 'string') return false;
  if (typeof location.country !== 'string') return false;

  return true;
};

type HouseData = Omit<HouseModel, 'id'>;
type PartialHouseData = PartialRecursive<HouseData>;

export const createHouse: RequestHandler<
  {},
  HouseModel | ResponseError,
  PartialHouseData,
  {}
> = (req, res) => {
  const houseData = req.body;
  if (!isHouseData(houseData)) {
    res.status(400).json({ error: 'Incorrect data' });
    return;
  }

  const newHouse: HouseModel = { id: '5', ...houseData };
  houses.push(newHouse);
  res.status(201).json(newHouse);
};
