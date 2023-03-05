const SELECT = `
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

const GROUP = 'GROUP BY h.id;';

const SQL = {
  SELECT,
  GROUP,
} as const;

export default SQL;
