import mysql from 'mysql';

import config from '../config';

const connection = mysql.createConnection(config.db);

export const connectMySql = (callback: VoidFunction) => {
  connection.connect((connectionErr) => {
    if (connectionErr) throw new Error(connectionErr.message);

    callback();
    connection.end();
  });
};

export default connection;
