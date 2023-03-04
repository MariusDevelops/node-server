import { RequestHandler } from 'express';
import mysql from 'mysql2/promise';
import config from '../../../config';
import { HouseModel } from '../types';

export const getHouses: RequestHandler<
  {},
  HouseModel[],
  {},
  {}
> = async (req, res) => {
  const mySqlConnection = await mysql.createConnection(config.db);
  const [houses] = await mySqlConnection.query<HouseModel[]>(`
    SELECT h.id, h.title, JSON_OBJECT('country', l.country, 'city', l.city) as location, h.price, h.rating, json_arrayagg(i.src) as images
    FROM images as i
    LEFT JOIN houses as h
    ON i.houseId = h.id
    LEFT JOIN  locations as l
    ON h.locationId = l.id
    GROUP BY h.id;
  `);
  await mySqlConnection.end();

  res.status(200).json(houses);
};
