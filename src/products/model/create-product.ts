import mysql from 'mysql2/promise';
import config from 'config';
import { ProductViewModel, ProductData } from '../types';
import SQL from './sql';

type CreateProductQueryResult = [
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  mysql.ResultSetHeader,
  ProductViewModel[],
];

export const createProduct = async (productData: ProductData): Promise<ProductViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);

  const preparedSql = `
    INSERT INTO details (material, sizes) VALUES 
    (?, ?);
    
    INSERT INTO products (title, price, rating, ownerId, detailId) VALUES
    (?, ?, ?, ?, LAST_INSERT_ID());

    SET @productId = LAST_INSERT_ID();
    
    INSERT INTO images (src, productId) VALUES
    ${productData.images.map(() => '(?, @productId)').join(',\n')};

    ${SQL.SELECT}
    WHERE h.id = @productId
    ${SQL.GROUP};
  `;
  const preparedSqlData = [
    productData.details.material,
    productData.details.sizes,
    productData.title,
    productData.price,
    productData.rating,
    productData.ownerId,
    ...productData.images,
  ];

  const [queryResultsArr] = await mySqlConnection.query(preparedSql, preparedSqlData);
  const [createdProduct] = (queryResultsArr as CreateProductQueryResult)[4];

  await mySqlConnection.end();

  return createdProduct;
};
