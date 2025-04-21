import { Router } from 'express';
import {
  sanitizeuserInput,
  findAll,
  findOne,
  newUser,
  update,
  remove,
  loginUser,
  forgotPassword,
  resetPassword,
} from './user.controller.js';
import { validateToken } from '../shared/validate-token.js';

export const userRouter = Router();
userRouter.get('/:id', validateToken, findOne);
userRouter.get('/', validateToken, findAll);
userRouter.post('/', sanitizeuserInput, newUser);
userRouter.post('/login', sanitizeuserInput, loginUser);
userRouter.post('/forgot-password', sanitizeuserInput, forgotPassword);
userRouter.post('/reset-password', sanitizeuserInput, resetPassword);
userRouter.put('/:id', validateToken, sanitizeuserInput, update);
userRouter.patch('/:id', validateToken, sanitizeuserInput, update);
userRouter.delete('/:id', validateToken, remove);
