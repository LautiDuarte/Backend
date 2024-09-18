import { Router } from 'express'
import { sanitizegameInput, findAll, findOne, add, update, remove } from './game.controller.js'
import { validateToken } from '../shared/db/validate-token.js';

export const gameRouter = Router()

gameRouter.get('/', validateToken, findAll);
gameRouter.get('/:id', validateToken, findOne);
gameRouter.post('/', validateToken, sanitizegameInput, add);
gameRouter.put('/:id', validateToken, sanitizegameInput, update);
gameRouter.patch('/:id', validateToken, sanitizegameInput, update);
gameRouter.delete('/:id', validateToken, remove);