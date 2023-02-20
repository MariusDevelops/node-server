/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

// setup
dotenv.config();

const { SERVER_PORT, SERVER_DOMAIN } = process.env;

if (SERVER_PORT === undefined || SERVER_DOMAIN === undefined) {
  throw new Error("Please define constants in '.env' file");
}

const server = express();

// Middlewares
server.use(morgan('tiny'));
server.use(express.static('public'));
server.use(express.json());

// API Router
const houses = [
  { id: 1, title: 'House 1' },
  { id: 2, title: 'House 2' },
  { id: 3, title: 'House 3' },
  { id: 4, title: 'House 4' },
];

const apiRouter = express.Router();
server.use('/api', apiRouter);

apiRouter.get('/houses', (req, res) => {
  res.status(200).json(houses);
});

apiRouter.post('/houses', (req, res) => {
  const { body } = req;
  const newHouse = { id: 5, title: body.title };
  houses.push(newHouse);
  res.status(201).json(newHouse);
});

// Server init
server.listen(SERVER_PORT, () => {
  console.log(`server is running on: http://${SERVER_DOMAIN}:${SERVER_PORT}`);
});
