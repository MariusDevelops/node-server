import express, { RequestHandler } from 'express';
import authMiddleware from 'middlewares/auth-middleware';
import { getHouse } from './queries/get-house';
import { getHouses } from './queries/get-houses';
import { createHouse } from './mutations/create-house';
import { updateHouse } from './mutations/update-house';
import { deleteHouse } from './mutations/delete-house';

const housesRouter = express.Router();

housesRouter.get('/', getHouses);
housesRouter.get('/:id', getHouse);

housesRouter.post('/', authMiddleware, createHouse);
housesRouter.patch('/:id', authMiddleware, updateHouse as RequestHandler);
housesRouter.delete('/:id', authMiddleware, deleteHouse as RequestHandler);

export default housesRouter;
