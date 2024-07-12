import { Router } from 'express'
import { sanitizegameTypeInput, findAll, findOne, add, update, remove } from './gameType.controller.js'

export const gameTypeRouter = Router()

gameTypeRouter.get('/', findAll)
gameTypeRouter.get('/:id', findOne)
gameTypeRouter.post('/', sanitizegameTypeInput, add)
gameTypeRouter.put('/:id', sanitizegameTypeInput, update)
gameTypeRouter.patch('/:id', sanitizegameTypeInput, update)
gameTypeRouter.delete('/:id', remove)