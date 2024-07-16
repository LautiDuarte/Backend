import { Router } from 'express'
import { sanitizeinscriptionInput, findAll, findOne, add, update, remove } from './inscription.controller.js'


export const inscriptionsRouter = Router()
inscriptionsRouter.get('/:id', findOne)
inscriptionsRouter.get('/', findAll)
inscriptionsRouter.post('/', sanitizeinscriptionInput, add)
inscriptionsRouter.put('/:id', sanitizeinscriptionInput, update)
inscriptionsRouter.patch('/:id', sanitizeinscriptionInput, update)
inscriptionsRouter.delete('/:id', remove)