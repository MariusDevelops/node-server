import express from 'express';
import morgan from 'morgan';
import config from 'config';
import houses from 'houses';
import auth from 'auth';
import { connectMySql } from './services/my-sql';

const server = express();

server.use(morgan('tiny'));
server.use(express.static('public'));
server.use(express.json());
server.use('/api/houses/', houses);
server.use('/api/auth/', auth);

connectMySql(() => {
  server.listen(config.server.port, () => {
    console.log(`server is running on: http://${config.server.domain}:${config.server.port}`);
  });
});