import { Router } from 'express'
import { sanitizenewsInput, findAll, findOne, add, update, remove } from './news.controller.js'
import { validateToken } from '../shared/db/validate-token.js';

export const newsRouter = Router()

newsRouter.get('/', validateToken, findAll);
newsRouter.get('/:id', validateToken, findOne);
newsRouter.post('/', validateToken, sanitizenewsInput, add);
newsRouter.put('/:id', validateToken, sanitizenewsInput, update);
newsRouter.patch('/:id', validateToken, sanitizenewsInput, update);
newsRouter.delete('/:id', validateToken, remove);