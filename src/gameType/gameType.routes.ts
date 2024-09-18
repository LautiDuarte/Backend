import { Router } from 'express'
import { sanitizegameTypeInput, findAll, findOne, add, update, remove } from './gameType.controller.js'
import { validateToken } from '../shared/db/validate-token.js'

export const gameTypeRouter = Router()

gameTypeRouter.get('/', validateToken, findAll)
gameTypeRouter.get('/:id', validateToken, findOne);
gameTypeRouter.post('/', validateToken, sanitizegameTypeInput, add);
gameTypeRouter.put('/:id', validateToken, sanitizegameTypeInput, update);
gameTypeRouter.patch('/:id', validateToken, sanitizegameTypeInput, update);
gameTypeRouter.delete('/:id', validateToken, remove);