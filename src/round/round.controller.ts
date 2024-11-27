import { orm } from '../shared/db/orm.js'
import { Request, Response, NextFunction } from 'express'
import { Round } from './round.entity.js'

const em = orm.em

function sanitizeRoundInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    competition: req.body.competition
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
    const rounds = await em.find(
      Round, 
      {},
      { populate: ['competition'] }
    )
    res.status(200).json(rounds)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const round = await em.findOneOrFail(
      Round, 
      { id },
      { populate: ['competition'] }
    )
    res
      .status(200)
      .json(round)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const round = em.create(Round, req.body.sanitizedInput)
    await em.flush()
    res
      .status(201)
      .json(round)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const round = em.getReference(Round, id)
    em.assign(round, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const round = em.getReference(Round, id)
    await em.removeAndFlush(round)
    res.status(200).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeRoundInput, findAll, findOne, add, update, remove }