import mysql from 'mysql2/promise';
import config from 'config';
import { HouseViewModel } from '../types';
import SQL from './sql';

export const getHouses = async (): Promise<HouseViewModel[]> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const sql = `
    ${SQL.SELECT}
    ${SQL.GROUP}
  `;
  const [houses] = await mySqlConnection.query<HouseViewModel[]>(sql);

  mySqlConnection.end();

  return houses;
};
