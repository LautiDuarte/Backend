import { Router } from 'express'
import { sanitizeMatchInput, findAll, findOne, add, update, remove } from './match.controller.js'
import { validateToken } from '../shared/db/validate-token.js';

export const matchRouter = Router()
matchRouter.get('/:id', validateToken, findOne);
matchRouter.get('/', validateToken, findAll);
matchRouter.post('/', validateToken, sanitizeMatchInput, add);
matchRouter.put('/:id', validateToken, sanitizeMatchInput, update);
matchRouter.patch('/:id', validateToken, sanitizeMatchInput, update)
matchRouter.delete('/:id', validateToken, remove);