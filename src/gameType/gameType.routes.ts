import { Router } from 'express'
import { sanitizegameTypeInput, findAll, findOne, add, update, remove } from './gameType.controller.js'
import { validateToken } from '../shared/validate-token.js'
import { checkAdmin } from '../shared/validate-role.js';

export const gameTypeRouter = Router()

gameTypeRouter.get('/', validateToken, findAll)
gameTypeRouter.get('/:id', validateToken, findOne);
gameTypeRouter.post('/', validateToken, checkAdmin, sanitizegameTypeInput, add);
gameTypeRouter.put('/:id', validateToken,checkAdmin, sanitizegameTypeInput, update);
gameTypeRouter.patch('/:id', validateToken,checkAdmin, sanitizegameTypeInput, update);
gameTypeRouter.delete('/:id', validateToken,checkAdmin, remove);