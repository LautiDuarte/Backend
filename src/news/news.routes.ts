import { Router } from 'express'
import { sanitizenewsInput, findAll, findOne, add, update, remove } from './news.controller.js'

export const newsRouter = Router()

newsRouter.get('/', findAll)
newsRouter.get('/:id', findOne)
newsRouter.post('/', sanitizenewsInput, add)
newsRouter.put('/:id', sanitizenewsInput, update)
newsRouter.patch('/:id', sanitizenewsInput, update)
newsRouter.delete('/:id', remove)