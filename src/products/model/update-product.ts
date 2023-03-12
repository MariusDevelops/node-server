import mysql from 'mysql2/promise';
import config from 'config';
import { colonObjectQueryFormat } from 'services/my-sql';
import { ProductViewModel, PartialProductBody } from '../types';
import SQL from './sql';

type PrepareSqlResult = [string, Record<string, string>];

type PrepareSql = (productData: PartialProductBody) => PrepareSqlResult;

const prepareImagesSql: PrepareSql = (productData) => {
  const bindingsOrNull = productData.images?.reduce((prevBindings, img, i) => ({
    ...prevBindings,
    [`img${i + 1}`]: img,
  }), {} as Record<string, string>) ?? null;
  const shouldInsert = bindingsOrNull !== null;
  const shouldInsertImages = productData.images !== undefined && productData.images.length > 0;

  const sql = shouldInsert
    ? `
      DELETE FROM images 
      WHERE images.productId = :id;
    
      ${shouldInsertImages ? `INSERT INTO images (src, productId) VALUES
        ${Object.keys(bindingsOrNull).map((imgBinding) => `(:${imgBinding}, :id)`).join(',\n')};`
      : ''}
    ` : '';

  const bindings = bindingsOrNull ?? {};

  return [sql, bindings];
};

const prepareDetailsSql: PrepareSql = (productData) => {
  const sql = productData.details !== undefined ? `
    INSERT INTO details (material, sizes) VALUES
    (:material, :sizes);` : '';
  const bindings = productData.details ?? {};

  return [sql, bindings];
};

const prepareProductSql: PrepareSql = (productData) => {
  const propsSql = [
    productData.title !== undefined ? 'title = :title' : null,
    productData.rating !== undefined ? 'rating = :rating' : null,
    productData.price !== undefined ? 'price = :price' : null,
    productData.details !== undefined ? 'detailId = LAST_INSERT_ID()' : null,
  ].filter((setPropSql) => setPropSql !== null).join(',\n');

  const sql = propsSql.length > 0 ? `
    UPDATE products SET
    ${propsSql}
    WHERE products.id = :id;
    ` : '';

  const bindings: Record<string, string> = {};
  if (productData.title !== undefined) bindings.title = productData.title;
  if (productData.rating !== undefined) bindings.rating = String(productData.rating);
  if (productData.price !== undefined) bindings.price = String(productData.price);

  return [sql, bindings];
};

// const prepareSqlArr = [prepareProductSql, prepareDetailsSql, prepareImagesSql];

export const updateProduct = async (
  id: string,
  productData: PartialProductBody,
): Promise<ProductViewModel> => {
  const mySqlConnection = await mysql.createConnection(config.db);
  mySqlConnection.config.queryFormat = colonObjectQueryFormat;

  // const [preparedSql, bindings] = prepareSqlArr.reduce<PreparationResult>(
  //   ([prevSql, prevBindings], prepareSql) => {
  //     const [sql, binds] = prepareSql(productData);

  //     return [
  //       sql + prevSql,
  //       { ...prevBindings, ...binds },
  //     ];
  //   },
  //   [`${SQL.SELECT} WHERE h.id = :id ${SQL.GROUP}`, { id }],
  // );

  const [imagesSql, imagesBindings] = prepareImagesSql(productData);
  const [detailSql, detailBindings] = prepareDetailsSql(productData);
  const [productSql, productBindings] = prepareProductSql(productData);

  const preparedSql = `
    ${imagesSql}
    ${detailSql}
    ${productSql}
    ${SQL.SELECT}
    WHERE h.id = :id
    ${SQL.GROUP};
  `.trim();

  const bindings = {
    id,
    ...imagesBindings,
    ...detailBindings,
    ...productBindings,
  };

  const [queryResultsArr] = await mySqlConnection.query<ProductViewModel[]>(preparedSql, bindings);
  const updatedProduct = queryResultsArr.at(-1) as ProductViewModel;

  await mySqlConnection.end();

  return updatedProduct;
};
