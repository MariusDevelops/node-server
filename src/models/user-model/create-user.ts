import mysql from 'mysql2/promise';
import config from 'config';
import BcryptService from 'services/brcypt-service';
import { RegistrationData, UserEntityRow } from '../../auth/types';
import SQL from './sql';

export const createUser = async ({
  email,
  password,
  name,
  surname,
  mobile,
}: RegistrationData): Promise<UserEntityRow> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    INSERT INTO users (email, password, name, surname, mobile) VALUES 
    (?, ?, ?, ?, ?);

    ${SQL.SELECT}
    WHERE users.id = LAST_INSERT_ID();
  `;

  const hashedPassword = BcryptService.hash(password);

  const preparedSqlData = [email, hashedPassword, name, surname, mobile];
  const [queryResultsArr] = await mySqlConnection.query(
    preparedSql,
    preparedSqlData,
  );

  const [createdUser] = (queryResultsArr as UserEntityRow[][])[1];

  mySqlConnection.end();

  return createdUser;
};
