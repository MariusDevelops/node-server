import express from 'express';
import morgan from 'morgan';
import config from './config';
import housesController from './controllers/houses-controller';

const server = express();

// Middlewares
server.use(morgan('tiny'));
server.use(express.static('public'));
server.use(express.json());
server.use('/api/houses/', housesController);

server.listen(config.server.port, () => {
  console.log(`server is running on: http://${config.server.domain}:${config.server.port}`);
});
