import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import mysql from 'mysql2/promise';
import { HouseModel, HouseData } from '../types';
import houseDataValidationSchema from '../validation-schemas/house-data-validation-schema';
import config from '../../../config';

type CreateHouseQueryResult =
  [
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    mysql.ResultSetHeader,
    HouseModel[],
  ];

export const createHouse: RequestHandler<
  {},
  HouseModel | ResponseError,
  HouseData,
  {}
> = async (req, res) => {
  try {
    const houseData: HouseData = houseDataValidationSchema
      .validateSync(req.body, { abortEarly: false });

    const mySqlConnection = await mysql.createConnection(config.db);

    const preparedSql = `
      INSERT INTO locations (country, city) VALUES 
      (?, ?);
      
      INSERT INTO houses (title, price, rating, locationId) VALUES
      (?, ?, ?, LAST_INSERT_ID());
      SET @houseId = LAST_INSERT_ID();
      
      INSERT INTO images (src, houseId) VALUES
      ${houseData.images.map(() => '(?, @houseId)').join(',\n')};
      SELECT h.id, h.title, JSON_OBJECT('country', l.country, 'city', l.city) as location, h.price, h.rating, json_arrayagg(i.src) as images
      FROM images as i
      LEFT JOIN houses as h
      ON i.houseId = h.id
      LEFT JOIN  locations as l
      ON h.locationId = l.id
      WHERE h.id = @houseId
      GROUP BY h.id;
    `;
    const preparedSqlData = [
      houseData.location.country,
      houseData.location.city,
      houseData.title,
      houseData.price,
      houseData.rating,
      ...houseData.images,
    ];

    const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
    const [createdHouse] = (queryResultsArr as CreateHouseQueryResult)[4];

    await mySqlConnection.end();

    res.status(201).json(createdHouse);
  } catch (err) {
    if (err instanceof ValidationError) {
      const manyErrors = err.errors.length > 1;
      res.status(400).json({
        error: manyErrors ? 'Validation errors' : err.errors[0],
        errors: manyErrors ? err.errors : undefined,
      });
    } else if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'Request error' });
    }
  }
};
