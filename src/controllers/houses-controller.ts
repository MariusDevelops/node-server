import { RequestHandler } from 'express';

type House = {
  id: number,
  title: string,
};

type ResponseError = {
  error: string
};

const houses: House[] = [
  { id: 1, title: 'House 1' },
  { id: 2, title: 'House 2' },
  { id: 3, title: 'House 3' },
  { id: 4, title: 'House 4' },
];

export const getHouses: RequestHandler<{}, House[], {}, {}> = (req, res) => {
  res.status(200).json(houses);
};

export const createHouse: RequestHandler<
  {},
  House | ResponseError,
  { title: string | undefined },
  {}
> = (req, res) => {
  const title = req.body?.title;
  if (title === undefined) {
    res.status(400).json({ error: 'title is required in request body' });
    return;
  }

  const newHouse = { id: 5, title };
  houses.push(newHouse);
  res.status(201).json(newHouse);
};
