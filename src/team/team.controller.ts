import { Team } from './team.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeteamInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    players: req.body.players,
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
    const teams = await em.find(
      Team, 
      {},
      { populate: ['players', 'registrations'] }
    )
    res.status(200).json({ message: 'found all teams', data: teams })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const team = await em.findOneOrFail(
      Team, 
      { id },
      { populate: ['players', 'registrations'] }
    )
    res
      .status(200)
      .json({ message: 'found team', data: team })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const players = req.body.sanitizedInput.players;
      if (players.length > 5){
        return res.status(400).json({message: 'A team cannot have more than 5 players'});
      }
    const team = em.create(Team, req.body.sanitizedInput)
    await em.flush()
    res
      .status(201)
      .json({ message: 'team created', data: team })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const players = req.body.sanitizedInput.players;
      if (players.length > 5){
        return res.status(400).json({message: 'A team cannot have more than 5 players'});
      }
    const id = Number.parseInt(req.params.id)
    const team = em.getReference(Team, id)
    em.assign(team, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'team updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const team = em.getReference(Team, id)
    await em.removeAndFlush(team)
    res.status(200).send({ message: 'team deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeteamInput, findAll, findOne, add, update, remove }