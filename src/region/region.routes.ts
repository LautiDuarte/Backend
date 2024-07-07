import { Router } from "express"
import { sanitizeregionInput, findAll, findOne, add, update, remove } from "./region.controller.js"

export const regionRouter = Router()

regionRouter.get('/', findAll)
regionRouter.get('/:id', findOne)
regionRouter.post('/', sanitizeregionInput, add)
regionRouter.put('/:id', sanitizeregionInput, update)
regionRouter.patch('/:id', sanitizeregionInput, update)
regionRouter.delete('/:id', remove)