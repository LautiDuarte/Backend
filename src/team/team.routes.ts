import { Router } from 'express'
import { sanitizeteamInput, findAll, findOne, add, update, remove } from './team.controller.js'


export const teamRouter = Router()
teamRouter.get('/:id', findOne)
teamRouter.get('/', findAll)
teamRouter.post('/', sanitizeteamInput, add)
teamRouter.put('/:id', sanitizeteamInput, update)
teamRouter.patch('/:id', sanitizeteamInput, update)
teamRouter.delete('/:id', remove)