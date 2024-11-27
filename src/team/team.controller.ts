import { Team } from './team.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { User } from '../user/user.entity.js'

const em = orm.em

function sanitizeteamInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    points: req.body.points,
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
      { populate: ['players', 'registrations'] }
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

    //valido si el nombre del team ya existe en la base de datos
    const existingTeam = await em.findOne(Team, { name });
    if (existingTeam) {
      return res.status(500).json({ message: `The team's name ${name} is already being used.` });
    }

    //creo al nuevo equipo
    const team = em.create(Team, req.body.sanitizedInput)

    //busco al usuario que esta creando el equipo
    const user = await em.findOne(User, { id: userCreator });
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    //agrego al usuario creador al equipo
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

    // Encuentro el equipo
    const team = await em.findOneOrFail(Team, teamId, {populate: ['players'] });

    // Encuentro el usuario
    const user = await em.findOneOrFail(User, userId);

    // Verifico si el usuario ya está en el equipo
    if (team.players.getItems().some(player => player.id === userId)) {
      return res.status(400).json({ message: 'You are in the team already.' });
    }

    // Verifico si el equipo tiene menos de 5 jugadores
    if (team.players.length >= 5) {
      return res.status(400).json({message: 'A team must have at least 5 players'})
    }

    // Añado el usuario al equipo
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

    // Encuentro el equipo
    const team = await em.findOneOrFail(Team, teamId, {populate: ['players'] });

    // Encuentro el usuario
    const user = await em.findOneOrFail(User, userId);

    // Verifico si el usuario ya está en el equipo
    if (!team.players.getItems().some(player => player.id === userId)) {
      return res.status(400).json({ message: 'Your are not in the team' });
    }

    // Elimino el usuario del equipo
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