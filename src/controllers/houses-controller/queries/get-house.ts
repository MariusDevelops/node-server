import { RequestHandler } from 'express';
import mysql from 'mysql2/promise';
import { HouseModel } from '../types';
import config from '../../../config';

export const getHouse: RequestHandler<
  { id: string | undefined },
  HouseModel | ResponseError,
  {},
  {}
> = async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    res.status(400).json({ error: 'server setup error' });
    return;
  }
  const mySqlConnection = await mysql.createConnection(config.db);
  const [houses] = await mySqlConnection.query<HouseModel[]>(`
      SELECT h.id, h.title, JSON_OBJECT('country', l.country, 'city', l.city) as location, h.price, h.rating, json_arrayagg(i.src) as images
      FROM images as i
      LEFT JOIN houses as h
      ON i.houseId = h.id
      LEFT JOIN  locations as l
      ON h.locationId = l.id
      WHERE h.id = ${id}
      GROUP BY h.id;
  `);
  await mySqlConnection.end();

  if (houses.length === 0) {
    res.status(404).json({ error: `house with id <${id}> was not found` });
    return;
  }

  res.status(200).json(houses[0]);
};
