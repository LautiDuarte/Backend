import { Router } from 'express';
import { sanitizetipoJuegoInput, findAll, findOne, add, update, remove } from './tipoJuego.controler.js';
export const tipoJuegoRouter = Router();
tipoJuegoRouter.get('/', findAll);
tipoJuegoRouter.get('/:id', findOne);
tipoJuegoRouter.post('/', sanitizetipoJuegoInput, add);
tipoJuegoRouter.put('/:id', sanitizetipoJuegoInput, update);
tipoJuegoRouter.patch('/:id', sanitizetipoJuegoInput, update);
tipoJuegoRouter.delete('/:id', remove);
//# sourceMappingURL=tipoJuego.routes.js.map