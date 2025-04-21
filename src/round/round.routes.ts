import { Router } from 'express'
import { sanitizeRoundInput, findAll, findOne, add, update, remove } from './round.controller.js'
import { validateToken } from '../shared/validate-token.js';

export const roundRouter = Router()
roundRouter.get('/:id', validateToken, findOne);
roundRouter.get('/', validateToken, findAll);
roundRouter.post('/', validateToken, sanitizeRoundInput, add);
roundRouter.put('/:id', validateToken, sanitizeRoundInput, update);
roundRouter.patch('/:id', validateToken, sanitizeRoundInput, update)
roundRouter.delete('/:id', validateToken, remove);