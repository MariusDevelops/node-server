import mysql from 'mysql2/promise';
import config from 'config';
import { NotFoundError } from 'services/error-service';
import { ProductViewModel } from '../types';
import SQL from './sql';

export const getProduct = async (id: string): Promise<ProductViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    ${SQL.SELECT}
    WHERE h.id = ?
    ${SQL.GROUP};
  `;

  const preparedSqlData = [id];
  const [products] = await mySqlConnection.query<ProductViewModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (products.length === 0) throw new NotFoundError(`product with id <${id}> was not found`);

  return products[0];
};
