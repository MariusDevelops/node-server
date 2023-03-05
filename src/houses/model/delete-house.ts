import mysql from 'mysql2/promise';
import config from 'config';
import { HouseViewModel } from '../types';

export const deleteHouse = async (id: string): Promise<void> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    DELETE FROM images WHERE houseId = ?;
    DELETE from houses WHERE id = ?;`;
  const preparedSqlData = [id, id];

  await mySqlConnection.query<HouseViewModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();
};
