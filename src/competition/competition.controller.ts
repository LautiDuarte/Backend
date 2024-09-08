import { Competition } from './competition.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizecompetitionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    type: req.body.type,
    dateStart: req.body.dateStart,
    dateEnding: req.body.dateEnding,
    game: req.body.game,
    region: req.body.region,
    userCreator: req.body.userCreator,
    registrations: req.body.registrations
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
    const competitions = await em.find(
      Competition, 
      {},
      { populate: ['game', 'region', 'userCreator', 'registrations'] }
    )
    res.status(200).json(competitions)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const competition = await em.findOneOrFail(
      Competition,
      { id },
      { populate: ['game', 'region', 'userCreator', 'registrations'] }
    )
    res
      .status(200)
      .json(competition)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const competition = em.create(Competition, req.body.sanitizedInput)
    await em.flush()
    res
      .status(201)
      .json(competition)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const competition = em.getReference(Competition, id)
    em.assign(competition, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const competition = em.getReference(Competition, id)
    await em.removeAndFlush(competition)
    res.status(200).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizecompetitionInput, findAll, findOne, add, update, remove }