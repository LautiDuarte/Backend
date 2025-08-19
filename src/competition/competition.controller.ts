import { Competition } from './competition.entity.js'
import { generateMatches } from './competition.service.js'
import { Team } from '../team/team.entity.js'
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


async function startCompetition(req: CompetitionRequest, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const competition = await em.findOneOrFail(Competition, { id }, {
      populate: ['registrations.team', 'userCreator'],
    })

    if (competition.userCreator?.id !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to start this competition' })
    }

    if (competition.dateStart) {
      return res.status(400).json({ message: 'Competition has already started' })
    }

    if (competition.dateInscriptionLimit && competition.dateInscriptionLimit > new Date()) {
      return res.status(400).json({ message: 'Inscription period is not over yet' })
    }

    const acceptedTeams = competition.registrations?.filter((r) => r.status === 'accepted').map((r) => r.team as Team) || []

    if (acceptedTeams.length < 2) {
      return res.status(400).json({ message: 'Not enough teams to start the competition' })
    }

    // Setear fecha de inicio si no tiene
    const now = new Date()
    competition.dateStart = now

    // Generar partidos
    const matches = generateMatches(acceptedTeams, competition, now)

    matches.forEach((m) => em.persist(m))
    await em.flush()

    res.status(200).json({ message: 'Competition started', matchesCount: matches.length })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function findAll(req: Request, res: Response) {
  try {
    const competitions = await em.find(
      Competition, 
      {},
      { populate: ['matches.teams', 'game', 'region', 'userCreator', 'registrations.team', 'registrations', 'winner'] }
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
      { populate: ['matches.teams', 'matches.winner', 'game', 'region', 'userCreator', 'registrations.team','registrations', 'winner'] }
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

    if (competition.dateStart) {
      const allowedFields = ['winner', 'dateEnd']
      const sanitized: any = {}
      
      for (const key of allowedFields) {
        if (req.body.sanitizedInput[key] !== undefined) {
          sanitized[key] = req.body.sanitizedInput[key]
        }
      }
      if (Object.keys(sanitized).length === 0) {
        return res.status(400).json({
          message: 'Cannot update initial fields after the competition has started',
        })
      }

      em.assign(competition, sanitized)
    } else {
      // Si no comenzó, puede actualizar cualquier campo permitido en sanitize
      em.assign(competition, req.body.sanitizedInput)
    }

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

export { sanitizecompetitionInput, startCompetition, findAll, findOne, add, update, remove }