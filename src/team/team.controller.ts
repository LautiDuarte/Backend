import { Team } from './team.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'

const em = orm.em

function sanitizeteamInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    points: req.body.points,
    userCreator: req.body.userCreator,
    players: req.body.players,
    registrations: req.body.registrations,
    matches: req.body.matches
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
      { populate: ['players', 'userCreator', 'registrations', 'matches'] }
    )
    res.status(200).json(teams)
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
      { populate: ['players', 'userCreator', 'registrations', 'matches'] }
    )
    res
      .status(200)
      .json(team)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const { name, userCreator } = req.body;

    const existingTeam = await em.findOne(Team, { name });
    if (existingTeam) {
      return res.status(500).json({ message: `The team's name ${name} is already being used.` });
    }

    const team = em.create(Team, req.body.sanitizedInput)

    const user = await em.findOne(User, { id: userCreator });
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    team.players.add(user);
    await em.flush();

    res.status(201).json(team)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function addUserToTeam(req: Request, res: Response) {
  try{
    const teamId = Number.parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const team = await em.findOneOrFail(Team, teamId, {populate: ['players'] });

    const user = await em.findOneOrFail(User, userId);

    if (team.players.getItems().some(player => player.id === userId)) {
      return res.status(400).json({ message: 'You are in the team already.' });
    }

    if (team.players.length >= 5) {
      return res.status(400).json({message: 'A team must have at least 5 players'})
    }

    team.players.add(user);
    await em.flush();

    res.status(200).json({message: 'User added'})
  } catch (error: any) {
    res.status(500).json({message: error.message})
  }
}

async function removeUserFromTeam(req: Request, res: Response) {
  try{
    const teamId = Number.parseInt(req.params.id);
    const userId = Number.parseInt(req.query.userId as string);

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const team = await em.findOneOrFail(Team, teamId, {populate: ['players'] });

    const user = await em.findOneOrFail(User, userId);

    if (!team.players.getItems().some(player => player.id === userId)) {
      return res.status(400).json({ message: 'Your are not in the team' });
    }

    team.players.remove(user);
    await em.flush();

    res.status(200).json({message: 'User removed'})
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const {name} = req.body.sanitizedInput
    if (!name) {
      return res.status(400).json({ message: 'Team\'s name is required' });
    }
    const team = em.getReference(Team, id)
    em.assign(team, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const team = em.getReference(Team, id)
    await em.removeAndFlush(team)
    res.status(200).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeteamInput, findAll, findOne, add, update, remove, addUserToTeam, removeUserFromTeam }