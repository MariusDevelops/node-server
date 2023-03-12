const SELECT = `
SELECT 
  h.id, 
  h.title, 
  JSON_OBJECT('material', l.material, 'sizes', l.sizes) as detail,
  h.price, 
  h.rating, 
  IF(COUNT(i.id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(i.src)) as images,
  JSON_OBJECT(
    'id', u.id,
    'name', u.name,
    'surname', u.surname,
    'email', u.email,
    'mobile', u.mobile
  ) as owner
FROM products as h
LEFT JOIN images as i
ON i.productId = h.id
LEFT JOIN  details as l
ON h.detailId = l.id
LEFT JOIN  users as u
ON u.id = h.ownerId
`;

const GROUP = 'GROUP BY h.id;';

const SQL = {
  SELECT,
  GROUP,
} as const;

export default SQL;
