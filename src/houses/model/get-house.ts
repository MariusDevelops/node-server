import mysql from 'mysql2/promise';
import config from 'config';
import { NotFoundError } from 'services/error-service';
import { HouseViewModel } from '../types';
import SQL from './sql';

export const getHouse = async (id: string): Promise<HouseViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    ${SQL.SELECT}
    WHERE h.id = ?
    ${SQL.GROUP};
  `;

  const preparedSqlData = [id];
  const [houses] = await mySqlConnection.query<HouseViewModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (houses.length === 0) throw new NotFoundError(`house with id <${id}> was not found`);

  return houses[0];
};
