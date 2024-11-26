import { Region } from './region.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeregionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    competitions: req.body.competitions,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
  }


  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const regions = await em.find(
      Region, 
      {},
      { populate: ['competitions'] }
    )
    res.status(200).json(regions)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const region = await em.findOneOrFail(
      Region,
      { id },
      { populate: ['competitions'] }
    )
    res
      .status(200)
      .json(region)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const region = em.create(Region, req.body.sanitizedInput)
    await em.flush()
    res
      .status(201)
      .json(region)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const region = em.getReference(Region, id)
    em.assign(region, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const region = em.getReference(Region, id)
    await em.removeAndFlush(region)
    res.status(200).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeregionInput, findAll, findOne, add, update, remove }