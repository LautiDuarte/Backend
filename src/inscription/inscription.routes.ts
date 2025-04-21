import { Router } from 'express'
import { sanitizeinscriptionInput, findAll, findOne, add, update, remove } from './inscription.controller.js'
import { validateToken } from '../shared/validate-token.js';


export const inscriptionRouter = Router()
inscriptionRouter.get('/:id', validateToken, findOne);
inscriptionRouter.get('/', validateToken, findAll);
inscriptionRouter.post('/', validateToken, sanitizeinscriptionInput, add);
inscriptionRouter.put('/:id', validateToken, sanitizeinscriptionInput, update);
inscriptionRouter.patch('/:id', validateToken, sanitizeinscriptionInput, update)
inscriptionRouter.delete('/:id', validateToken, remove);