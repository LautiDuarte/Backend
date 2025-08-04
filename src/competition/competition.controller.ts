import { Competition } from './competition.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'

const em = orm.em

interface CompetitionRequest extends Request {
  user?: {
    id: number
    name: string
    role: 'user' | 'admin'
  }
}

function sanitizecompetitionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    winner: req.body.winner,
    dateInscriptionLimit: req.body.dateInscriptionLimit,
    maxTeams: req.body.maxTeams,
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

async function update(req: CompetitionRequest, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)

    const competition = await em.findOneOrFail(Competition, { id }, { populate: ['userCreator'] })

    if (competition.userCreator?.id !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this competition' })
    }

    em.assign(competition, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: CompetitionRequest, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)

    const competition = await em.findOneOrFail(Competition, { id }, { populate: ['userCreator'] })

    if (competition.userCreator?.id !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this competition' })
    }

    await em.removeAndFlush(competition)
    res.status(200).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizecompetitionInput, findAll, findOne, add, update, remove }