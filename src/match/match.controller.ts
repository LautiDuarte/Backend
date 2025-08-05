import { orm } from '../shared/db/orm.js'
import { Request, Response, NextFunction } from 'express'
import { Match } from './match.entity.js'

const em = orm.em

function sanitizeMatchInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    matchDate: req.body.matchDate,
    competition: req.body.competition,
    round: req.body.round,
    winner: req.body.winner,
    teams: req.body.teams
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
    const matches = await em.find(
      Match, 
      {},
      { populate: ['competition', 'teams'] }
    )
    res.status(200).json(matches)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const match = await em.findOneOrFail(
      Match, 
      { id },
      { populate: ['competition', 'teams']}
    )
    res
      .status(200)
      .json(match)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const match = em.create(Match, req.body.sanitizedInput)
    await em.flush()
    res
      .status(201)
      .json(match)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const match = em.getReference(Match, id)
    em.assign(match, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const match = em.getReference(Match, id)
    await em.removeAndFlush(match)
    res.status(200).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeMatchInput, findAll, findOne, add, update, remove }