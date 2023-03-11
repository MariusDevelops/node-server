import mysql from 'mysql2/promise';
import config from 'config';
import { HouseViewModel, HouseData } from '../types';
import SQL from './sql';

type CreateHouseQueryResult = [
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  HouseViewModel[],
];

export const createHouse = async (houseData: HouseData): Promise<HouseViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    INSERT INTO locations (country, city) VALUES 
    (?, ?);
    
    INSERT INTO houses (title, price, rating, ownerId, locationId) VALUES
    (?, ?, ?, ?, LAST_INSERT_ID());

    SET @houseId = LAST_INSERT_ID();
    
    INSERT INTO images (src, houseId) VALUES
    ${houseData.images.map(() => '(?, @houseId)').join(',\n')};

    ${SQL.SELECT}
    WHERE h.id = @houseId
    ${SQL.GROUP};
  `;
  const preparedSqlData = [
    houseData.location.country,
    houseData.location.city,
    houseData.title,
    houseData.price,
    houseData.rating,
    houseData.ownerId,
    ...houseData.images,
  ];

  const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
  const [createdHouse] = (queryResultsArr as CreateHouseQueryResult)[4];

  await mySqlConnection.end();

  return createdHouse;
};
