import { Router } from 'express'
import { sanitizenewsInput, findAll, findOne, add, update, remove } from './news.controller.js'
import { validateToken } from '../shared/validate-token.js';
import { checkAdmin } from '../shared/validate-role.js';

export const newsRouter = Router()

newsRouter.get('/', validateToken, findAll);
newsRouter.get('/:id', validateToken, findOne);
newsRouter.post('/', validateToken, checkAdmin, sanitizenewsInput, add);
newsRouter.put('/:id', validateToken, checkAdmin, sanitizenewsInput, update);
newsRouter.patch('/:id', validateToken, checkAdmin, sanitizenewsInput, update);
newsRouter.delete('/:id', validateToken, checkAdmin, remove);