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

export function colonObjectQueryFormat(
  this: mysql.Connection,
  query: string,
  valueObj?: Record<string, string>,
) {
  if (valueObj === undefined) return query;
  return query.replace(/:(\w+)/g, (txt: string, key: string) => {
    if (key in valueObj) {
      return this.escape(valueObj[key]);
    }
    return txt;
  });
}

export default MySql;
