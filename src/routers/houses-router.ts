import express from 'express';
import { createHouse, getHouses } from '../controllers/houses-controller';

const housesRouter = express.Router();

housesRouter.get('/', getHouses);
housesRouter.post('/', createHouse);

export default housesRouter;
