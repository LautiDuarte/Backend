import { TipoJuego } from './tipoJuego.entity.js';
import { tipoJuegoRepository } from './tipoJuego.repository.js';
const repository = new tipoJuegoRepository();
function sanitizetipoJuegoInput(req, res, next) {
    req.body.sanitizedInput = {
        name: req.body.name,
        description: req.body.description,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const id = req.params.id;
    const tipoJuego = repository.findOne({ id });
    if (!tipoJuego) {
        return res.status(404).send({ message: 'tipoJuego not found' });
    }
    res.json({ data: tipoJuego });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const tipoJuegoInput = new TipoJuego(input.name, input.description);
    const tipoJuego = repository.add(tipoJuegoInput);
    return res.status(201).send({ message: 'tipoJuego created', data: tipoJuego });
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const tipoJuego = repository.update(req.body.sanitizedInput);
    if (!tipoJuego) {
        return res.status(404).send({ message: 'tipoJuego not found' });
    }
    return res.status(200).send({ message: 'tipoJuego updated successfully', data: tipoJuego });
}
function remove(req, res) {
    const id = req.params.id;
    const tipoJuego = repository.delete({ id });
    if (!tipoJuego) {
        res.status(404).send({ message: 'tipoJuego not found' });
    }
    else {
        res.status(200).send({ message: 'tipoJuego deleted successfully' });
    }
}
export { sanitizetipoJuegoInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=tipoJuego.controler.js.map