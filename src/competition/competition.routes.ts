import { Router } from 'express'
import { sanitizecompetitionInput, findAll, findOne, add, update, remove } from './competition.controller.js'


export const competitionRouter = Router()
competitionRouter.get('/:id', findOne)
competitionRouter.get('/', findAll)
competitionRouter.post('/', sanitizecompetitionInput, add)
competitionRouter.put('/:id', sanitizecompetitionInput, update)
competitionRouter.patch('/:id', sanitizecompetitionInput, update)
competitionRouter.delete('/:id', remove)