import mysql from 'mysql2/promise';
import config from '../config';
import { HouseModel, HouseData, PartialHouseData } from '../controllers/houses-controller/types';
import { colonObjectQueryFormat } from './my-sql';

type CreateHouseQueryResult = [
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  HouseModel[],
];

const SQL_SELECT = `
SELECT 
  h.id, 
  h.title, 
  JSON_OBJECT('country', l.country, 'city', l.city) as location,
  h.price, 
  h.rating, 
  IF(COUNT(i.id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(i.src)) as images
FROM houses as h
LEFT JOIN images as i
ON i.houseId = h.id
LEFT JOIN  locations as l
ON h.locationId = l.id`;
const SQL_GROUP = 'GROUP BY h.id;';
const SQL_WHERE_ID = 'WHERE h.id = ?';

const getHouses = async (): Promise<HouseModel[]> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const sql = [SQL_SELECT, SQL_GROUP].join('\n');
  const [houses] = await mySqlConnection.query<HouseModel[]>(sql);

  mySqlConnection.end();

  return houses;
};

const getHouse = async (id: string): Promise<HouseModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = [SQL_SELECT, SQL_WHERE_ID, SQL_GROUP].join('\n');
  const preparedSqlData = [id];
  const [houses] = await mySqlConnection.query<HouseModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();

  if (houses.length === 0) {
    throw new Error(`house with id <${id}> was not found`);
  }

  return houses[0];
};

const createHouse = async (houseData: HouseData): Promise<HouseModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    INSERT INTO locations (country, city) VALUES 
    (?, ?);
    
    INSERT INTO houses (title, price, rating, locationId) VALUES
    (?, ?, ?, LAST_INSERT_ID());
    SET @houseId = LAST_INSERT_ID();
    
    INSERT INTO images (src, houseId) VALUES
    ${houseData.images.map(() => '(?, @houseId)').join(',\n')};
    ${SQL_SELECT}
    WHERE h.id = @houseId
    ${SQL_GROUP};
  `;
  const preparedSqlData = [
    houseData.location.country,
    houseData.location.city,
    houseData.title,
    houseData.price,
    houseData.rating,
    ...houseData.images,
  ];

  const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
  const [createdHouse] = (queryResultsArr as CreateHouseQueryResult)[4];

  await mySqlConnection.end();

  return createdHouse;
};

const updateHouse = async (id: string, houseData: PartialHouseData): Promise<HouseModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);
  mySqlConnection.config.queryFormat = colonObjectQueryFormat;

  // Images SQL
  const imagesBindings = houseData.images?.reduce((prevBindings, img, i) => ({
    ...prevBindings,
    [`img${i + 1}`]: img,
  }), {} as Record<string, string>) ?? null;
  const shouldAddNewImages = houseData.images !== undefined && houseData.images.length > 0;
  const imagesUpdatePreparedSql = imagesBindings !== null
    ? `
      DELETE FROM images 
      WHERE images.houseId = :id;
    
      ${shouldAddNewImages ? `INSERT INTO images (src, houseId) VALUES
        ${Object.keys(imagesBindings).map((imgBinding) => `(:${imgBinding}, :id)`).join(',\n')};`
      : ''}
    ` : '';

  // Location SQL
  const locationExist = houseData.location !== undefined;
  const locationInsertSql = locationExist ? `
    INSERT INTO locations (country, city) VALUES
    (:country, :city);` : '';

  // Property SQL
  const houseSetPropsSql = [
    houseData.title !== undefined ? 'title = :title' : null,
    houseData.rating !== undefined ? 'rating = :rating' : null,
    houseData.price !== undefined ? 'price = :price' : null,
    locationExist ? 'locationId = LAST_INSERT_ID()' : null,
  ].filter((setPropSql) => setPropSql !== null).join(',\n');

  const preparedSql = `
    ${imagesUpdatePreparedSql}
    ${locationInsertSql}
    ${houseSetPropsSql.length > 0 ? `
    UPDATE houses SET
      ${houseSetPropsSql}
      WHERE houses.id = :id;
    ` : ''}
    SELECT 
      h.id, 
      h.title,
      JSON_OBJECT('country', l.country, 'city', l.city) as location,
      h.price, 
      h.rating, 
      IF(COUNT(i.id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(i.src)) as images
    FROM houses as h
    LEFT JOIN images as i
    ON i.houseId = h.id
    LEFT JOIN  locations as l
    ON h.locationId = l.id
    WHERE h.id = :id
    GROUP BY h.id;
  `.trim();

  const bindings = {
    id,
    ...imagesBindings,
    ...houseData.location,
    title: houseData.title,
    rating: houseData.rating,
    price: houseData.price,
  };

  const [queryResultsArr] = await mySqlConnection.query<HouseModel[]>(preparedSql, bindings);
  const updatedHouse = queryResultsArr.at(-1) as HouseModel;

  await mySqlConnection.end();

  return updatedHouse;
};

const deleteHouse = async (id: string): Promise<void> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    DELETE FROM images WHERE houseId = ?;
    DELETE from houses WHERE id = ?;
    `;
  const preparedSqlData = [id, id];

  await mySqlConnection.query<HouseModel[]>(preparedSql, preparedSqlData);

  mySqlConnection.end();
};

const HouseService = {
  getHouse,
  getHouses,

  createHouse,
  updateHouse,
  deleteHouse,
};

export default HouseService;
