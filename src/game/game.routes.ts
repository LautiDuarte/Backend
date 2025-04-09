import { Router } from 'express'
import { sanitizegameInput, findAll, findOne, add, update, remove } from './game.controller.js'
import { validateToken } from '../shared/db/validate-token.js';
import { checkAdmin } from '../middlewares/role.middleware.js';

export const gameRouter = Router()

gameRouter.get('/', validateToken, findAll);
gameRouter.get('/:id', validateToken, findOne);
gameRouter.post('/', validateToken, checkAdmin, sanitizegameInput, add);
gameRouter.put('/:id', validateToken, checkAdmin, sanitizegameInput, update);
gameRouter.patch('/:id', validateToken, checkAdmin, sanitizegameInput, update);
gameRouter.delete('/:id', validateToken, checkAdmin, remove);