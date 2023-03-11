SELECT 
	h.id, 
    h.title, 
    JSON_OBJECT(
		'country', l.country,
        'city', l.city
	) as location, 
  h.price,
  h.rating,
  IF(COUNT(i.id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(i.src)) as images,
  JSON_OBJECT(
		'name', u.name,
		'surname', u.surname,
		'email', u.email,
		'mobile', u.mobile
	) as owner
FROM images as i
LEFT JOIN houses as h
ON i.houseId = h.id
LEFT JOIN  locations as l
ON h.locationId = l.id
LEFT JOIN users as u
ON u.id = h.ownerId
GROUP BY h.id;
