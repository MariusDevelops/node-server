import express from 'express';
import authMiddleware from 'middlewares/auth-middleware';
import { login } from './methods/login';
import { register } from './methods/register';
import { auth } from './methods/auth';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/auth', authMiddleware, auth);

export default router;
