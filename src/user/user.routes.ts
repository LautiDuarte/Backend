import { Router } from 'express';
import {
  sanitizeuserInput,
  findAll,
  findOne,
  newUser,
  update,
  remove,
  loginUser,
} from './user.controller.js';
import { validateToken } from '../shared/db/validate-token.js';

export const userRouter = Router();
userRouter.get('/:id', validateToken, findOne);
userRouter.get('/', validateToken, findAll);
userRouter.post('/', validateToken, sanitizeuserInput, newUser);
userRouter.post('/login', validateToken, sanitizeuserInput, loginUser);
userRouter.put('/:id', validateToken, sanitizeuserInput, update);
userRouter.patch('/:id', validateToken, sanitizeuserInput, update);
userRouter.delete('/:id', validateToken, remove);
