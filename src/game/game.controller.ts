import { Game } from './game.entity.js';
import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizegameInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    gameType: req.body.gameType,
    competitions: req.body.competitions,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
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
    const games = await em.find(
      Game,
      {},
      { populate: ['gameType', 'competitions'] }
    );
    res.status(200).json(games);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const game = await em.findOneOrFail(
      Game,
      { id },
      { populate: ['gameType', 'competitions'] }
    );
    res.status(200).json(game);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const game = em.create(Game, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json(game);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const game = em.getReference(Game, id);
    em.assign(game, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const game = em.getReference(Game, id);
    await em.removeAndFlush(game);
    res.status(200).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizegameInput, findAll, findOne, add, update, remove };
