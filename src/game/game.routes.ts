import { Router } from 'express'
import { sanitizegameInput, findAll, findOne, add, update, remove } from './game.controller.js'

export const gameRouter = Router()

gameRouter.get('/', findAll)
gameRouter.get('/:id', findOne)
gameRouter.post('/', sanitizegameInput, add)
gameRouter.put('/:id', sanitizegameInput, update)
gameRouter.patch('/:id', sanitizegameInput, update)
gameRouter.delete('/:id', remove)