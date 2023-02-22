import express from 'express';
import {
  getHouses,
  getHouse,

  createHouse,
  updateHouse,
  deleteHouse,
} from '../controllers/houses-controller';

const housesRouter = express.Router();

housesRouter.get('/', getHouses);
housesRouter.get('/:id', getHouse);

housesRouter.post('/', createHouse);
housesRouter.patch('/:id', updateHouse);
housesRouter.delete('/:id', deleteHouse);

export default housesRouter;
