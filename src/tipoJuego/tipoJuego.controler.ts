import { TipoJuego } from './tipoJuego.entity.js'
import { Request, Response, NextFunction } from 'express'
import { tipoJuegoRepository } from './tipoJuego.repository.js'

const repository = new tipoJuegoRepository()

function sanitizetipoJuegoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
  }


  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() })
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id
  const tipoJuego = await repository.findOne({ id })
  if (!tipoJuego) {
    return res.status(404).send({ message: 'tipoJuego not found' })
  }
  res.json({ data: tipoJuego })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  
  const tipoJuegoInput = new TipoJuego(
    input.name,
    input.description
  )

  const tipoJuego = repository.add(tipoJuegoInput)
  return res.status(201).send({ message: 'tipoJuego created', data: tipoJuego })
}

async function update(req: Request, res: Response) {
  const tipoJuego = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!tipoJuego) {
    return res.status(404).send({ message: 'tipoJuego not found' })
  }

  return res.status(200).send({ message: 'tipoJuego updated successfully', data: tipoJuego })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const tipoJuego = await repository.delete({ id })

  if (!tipoJuego) {
    res.status(404).send({ message: 'tipoJuego not found' })
  } else {
    res.status(200).send({ message: 'tipoJuego deleted successfully' })
  }
}

export { sanitizetipoJuegoInput, findAll, findOne, add, update, remove }