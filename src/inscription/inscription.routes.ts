import { Router } from 'express'
import { sanitizeinscriptionInput, findAll, findOne, add, update, remove } from './inscription.controller.js'


export const inscriptionRouter = Router()
inscriptionRouter.get('/:id', findOne)
inscriptionRouter.get('/', findAll)
inscriptionRouter.post('/', sanitizeinscriptionInput, add)
inscriptionRouter.put('/:id', sanitizeinscriptionInput, update)
inscriptionRouter.patch('/:id', sanitizeinscriptionInput, update)
inscriptionRouter.delete('/:id', remove)