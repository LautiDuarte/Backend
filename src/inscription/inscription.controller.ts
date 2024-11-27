import { Inscription } from './inscription.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Team } from '../team/team.entity.js'
import { Competition } from '../competition/competition.entity.js'

const em = orm.em

function sanitizeinscriptionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    date: req.body.date,
    status: req.body.status,
    competition: req.body.competition,
    team: req.body.team
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
    const inscriptions = await em.find(
      Inscription, 
      {},
      { populate: ['competition', 'team'] }
    )
    res.status(200).json(inscriptions)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const inscription = await em.findOneOrFail(
      Inscription, 
      { id },
      { populate: ['competition', 'team'] }
    )
    res
      .status(200)
      .json(inscription)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response){
  try{
    const { competition, team, date } = req.body.sanitizedInput;
    console.log(req.body);

    const foundCompetition = await em.findOneOrFail(Competition, { id: competition });
    if (new Date(date) > new Date(foundCompetition.dateInscriptionLimit)) {
      return res.status(400).json({ 
        message: 'The inscription date exceeds the competition’s date limit.' 
      });
    }

    const teamEntity = await em.findOneOrFail(Team, team, { populate: ['players'] });
    if (teamEntity.players.length < 5){
      return res.status(400).json({ message: 'Team has not enough members. (Min. 5 players).' });
    }

    const existingInscription = await em.findOne(Inscription, { competition, team });
    if (existingInscription) {
      return res.status(400).json({message: 'The team is already registered in this competition.'})
    }

    const inscription = em.create(Inscription, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json(inscription)
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/*async function add(req: Request, res: Response) {
  try {
    const inscription = em.create(Inscription, req.body.sanitizedInput)
    await em.flush()
    res
      .status(201)
      .json(inscription)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}*/

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const inscription = em.getReference(Inscription, id)
    em.assign(inscription, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const inscription = em.getReference(Inscription, id)
    await em.removeAndFlush(inscription)
    res.status(200).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeinscriptionInput, findAll, findOne, add, update, remove }