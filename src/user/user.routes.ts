import { Router } from 'express'
import { sanitizeuserInput, findAll, findOne, add, update, remove } from './user.controller.js'


export const userRouter = Router()
userRouter.get('/:id', findOne)
userRouter.get('/', findAll)
userRouter.post('/', sanitizeuserInput, add)
userRouter.put('/:id', sanitizeuserInput, update)
userRouter.patch('/:id', sanitizeuserInput, update)
userRouter.delete('/:id', remove)