import { Region } from "./region.entity.js"
import { Request, Response, NextFunction } from "express"
import { RegionRepository } from "./region.repository.js"

const repository = new RegionRepository()

function sanitizeregionInput(req: Request, res: Response, next: NextFunction) {
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
  const region = await repository.findOne({ id })
  if (!region) {
    return res.status(404).send({ message: 'region not found' })
  }
  res.json({ data: region })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  
  const regionInput = new Region(
    input.name,
    input.description
  )

  const region = repository.add(regionInput)
  return res.status(201).send({ message: 'region created', data: region })
}

async function update(req: Request, res: Response) {
  const region = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!region) {
    return res.status(404).send({ message: 'region not found' })
  }

  return res.status(200).send({ message: 'region updated successfully', data: region })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const region = await repository.delete({ id })

  if (!region) {
    res.status(404).send({ message: 'region not found' })
  } else {
    res.status(200).send({ message: 'region deleted successfully' })
  }
}

export { sanitizeregionInput, findAll, findOne, add, update, remove }