import { GameType } from './gameType.entity.js';
import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizegameTypeInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const gametypes = await em.find(GameType, {});
    res.status(200).json(gametypes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const gametype = await em.findOneOrFail(GameType, { id });
    res.status(200).json(gametype);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const gametype = em.create(GameType, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json(gametype);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const gametype = em.getReference(GameType, id);
    em.assign(gametype, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const gametype = em.getReference(GameType, id);
    await em.removeAndFlush(gametype);
    res.status(200).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizegameTypeInput, findAll, findOne, add, update, remove };
