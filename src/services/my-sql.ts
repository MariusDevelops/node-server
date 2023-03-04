import mysql from 'mysql2';
import config from '../config';

const MySql = mysql.createConnection(config.db);

export const connectMySql = (callback: VoidFunction) => {
  MySql.connect((connectionErr) => {
    if (connectionErr) throw new Error(connectionErr.message);

    callback();
    MySql.end();
  });
};

export default MySql;
