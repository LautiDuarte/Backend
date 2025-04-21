import { Router } from "express"
import { sanitizeregionInput, findAll, findOne, add, update, remove } from "./region.controller.js"
import { validateToken } from "../shared/validate-token.js";
import { checkAdmin } from "../shared/validate-role.js";

export const regionRouter = Router()

regionRouter.get('/', validateToken, findAll);
regionRouter.get('/:id', validateToken, findOne);
regionRouter.post('/', validateToken, checkAdmin, sanitizeregionInput, add);
regionRouter.put('/:id', validateToken, checkAdmin, sanitizeregionInput, update);
regionRouter.patch('/:id', validateToken, checkAdmin, sanitizeregionInput, update);
regionRouter.delete('/:id', validateToken, checkAdmin, remove);