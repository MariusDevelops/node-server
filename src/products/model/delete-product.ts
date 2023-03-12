import mysql from 'mysql2/promise';
import config from 'config';
import { ProductViewModel } from '../types';

export const deleteProduct = async (id: string): Promise<void> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    DELETE FROM images WHERE productId = ?;
    DELETE from products WHERE id = ?;`;
  const preparedSqlData = [id, id];

  await mySqlConnection.query<ProductViewModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();
};
