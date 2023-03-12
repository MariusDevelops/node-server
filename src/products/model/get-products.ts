import mysql from 'mysql2/promise';
import config from 'config';
import { ProductViewModel } from '../types';
import SQL from './sql';

export const getProducts = async (): Promise<ProductViewModel[]> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const sql = `
    ${SQL.SELECT}
    ${SQL.GROUP}
  `;
  const [products] = await mySqlConnection.query<ProductViewModel[]>(sql);

  mySqlConnection.end();

  return products;
};
