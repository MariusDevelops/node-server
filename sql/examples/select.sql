SELECT id, title, rating, price
FROM houses
WHERE price > 30 AND price < 70
ORDER BY rating desc, price
LIMIT 2;