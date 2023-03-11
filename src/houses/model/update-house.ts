import mysql from 'mysql2/promise';
import config from 'config';
import { colonObjectQueryFormat } from 'services/my-sql';
import { HouseViewModel, PartialHouseBody } from '../types';
import SQL from './sql';

type PrepareSqlResult = [string, Record<string, string>];

type PrepareSql = (houseData: PartialHouseBody) => PrepareSqlResult;

const prepareImagesSql: PrepareSql = (houseData) => {
  const bindingsOrNull = houseData.images?.reduce((prevBindings, img, i) => ({
    ...prevBindings,
    [`img${i + 1}`]: img,
  }), {} as Record<string, string>) ?? null;
  const shouldInsert = bindingsOrNull !== null;
  const shouldInsertImages = houseData.images !== undefined && houseData.images.length > 0;

  const sql = shouldInsert
    ? `
      DELETE FROM images 
      WHERE images.houseId = :id;
    
      ${shouldInsertImages ? `INSERT INTO images (src, houseId) VALUES
        ${Object.keys(bindingsOrNull).map((imgBinding) => `(:${imgBinding}, :id)`).join(',\n')};`
      : ''}
    ` : '';

  const bindings = bindingsOrNull ?? {};

  return [sql, bindings];
};

const prepareLocationSql: PrepareSql = (houseData) => {
  const sql = houseData.location !== undefined ? `
    INSERT INTO locations (country, city) VALUES
    (:country, :city);` : '';
  const bindings = houseData.location ?? {};

  return [sql, bindings];
};

const prepareHouseSql: PrepareSql = (houseData) => {
  const propsSql = [
    houseData.title !== undefined ? 'title = :title' : null,
    houseData.rating !== undefined ? 'rating = :rating' : null,
    houseData.price !== undefined ? 'price = :price' : null,
    houseData.location !== undefined ? 'locationId = LAST_INSERT_ID()' : null,
  ].filter((setPropSql) => setPropSql !== null).join(',\n');

  const sql = propsSql.length > 0 ? `
    UPDATE houses SET
    ${propsSql}
    WHERE houses.id = :id;
    ` : '';

  const bindings: Record<string, string> = {};
  if (houseData.title !== undefined) bindings.title = houseData.title;
  if (houseData.rating !== undefined) bindings.rating = String(houseData.rating);
  if (houseData.price !== undefined) bindings.price = String(houseData.price);

  return [sql, bindings];
};

// const prepareSqlArr = [prepareHouseSql, prepareLocationSql, prepareImagesSql];

export const updateHouse = async (
  id: string,
  houseData: PartialHouseBody,
): Promise<HouseViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);
  mySqlConnection.config.queryFormat = colonObjectQueryFormat;

  // const [preparedSql, bindings] = prepareSqlArr.reduce<PreparationResult>(
  //   ([prevSql, prevBindings], prepareSql) => {
  //     const [sql, binds] = prepareSql(houseData);

  //     return [
  //       sql + prevSql,
  //       { ...prevBindings, ...binds },
  //     ];
  //   },
  //   [`${SQL.SELECT} WHERE h.id = :id ${SQL.GROUP}`, { id }],
  // );

  const [imagesSql, imagesBindings] = prepareImagesSql(houseData);
  const [locationSql, locationBindings] = prepareLocationSql(houseData);
  const [houseSql, houseBindings] = prepareHouseSql(houseData);

  const preparedSql = `
    ${imagesSql}
    ${locationSql}
    ${houseSql}
    ${SQL.SELECT}
    WHERE h.id = :id
    ${SQL.GROUP};
  `.trim();

  const bindings = {
    id,
    ...imagesBindings,
    ...locationBindings,
    ...houseBindings,
  };

  const [queryResultsArr] = await mySqlConnection.query<HouseViewModel[]>(preparedSql, bindings);
  const updatedHouse = queryResultsArr.at(-1) as HouseViewModel;

  await mySqlConnection.end();

  return updatedHouse;
};
