import { Router } from 'express'
import { sanitizeteamInput, findAll, findOne, add, update, remove, addUserToTeam, removeUserFromTeam } from './team.controller.js'
import { validateToken } from '../shared/db/validate-token.js';


export const teamRouter = Router()
teamRouter.get('/:id', validateToken, findOne);
teamRouter.get('/', validateToken, findAll);
teamRouter.post('/', validateToken, sanitizeteamInput, add);
teamRouter.post('/:id/user', validateToken, addUserToTeam);
teamRouter.delete('/:id/user', validateToken, removeUserFromTeam);
teamRouter.put('/:id', validateToken, sanitizeteamInput, update);
teamRouter.patch('/:id', validateToken, sanitizeteamInput, update);
teamRouter.delete('/:id', validateToken, remove);