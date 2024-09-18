import { Router } from "express"
import { sanitizeregionInput, findAll, findOne, add, update, remove } from "./region.controller.js"
import { validateToken } from "../shared/db/validate-token.js";

export const regionRouter = Router()

regionRouter.get('/', validateToken, findAll);
regionRouter.get('/:id', validateToken, findOne);
regionRouter.post('/', validateToken, sanitizeregionInput, add);
regionRouter.put('/:id', validateToken, sanitizeregionInput, update);
regionRouter.patch('/:id', validateToken, sanitizeregionInput, update);
regionRouter.delete('/:id', validateToken, remove);