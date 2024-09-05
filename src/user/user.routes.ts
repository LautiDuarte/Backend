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

export const userRouter = Router();
userRouter.get('/:id', findOne);
userRouter.get('/', findAll);
userRouter.post('/', sanitizeuserInput, newUser);
userRouter.post('/login', sanitizeuserInput, loginUser);
userRouter.put('/:id', sanitizeuserInput, update);
userRouter.patch('/:id', sanitizeuserInput, update);
userRouter.delete('/:id', remove);
