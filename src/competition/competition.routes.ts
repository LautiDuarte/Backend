import { Router } from 'express'
import { sanitizecompetitionInput, findAll, findOne, add, update, remove } from './competition.controller.js'
import { validateToken } from '../shared/db/validate-token.js';


export const competitionRouter = Router()
competitionRouter.get('/:id', validateToken, findOne);
competitionRouter.get('/', validateToken, findAll);
competitionRouter.post('/', validateToken, sanitizecompetitionInput, add);
competitionRouter.put('/:id', validateToken, sanitizecompetitionInput, update);
competitionRouter.patch('/:id', validateToken, sanitizecompetitionInput, update)
competitionRouter.delete('/:id', validateToken, remove);