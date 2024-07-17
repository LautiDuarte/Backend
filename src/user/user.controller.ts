import { User } from './user.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeuserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    lastName: req.body.lastName,
    alias: req.body.alias,
    email: req.body.email,
    password: req.body.password,
    teams: req.body.teams,
    competitionsCreated: req.body.competitionsCreated
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
    const users = await em.find(
      User, 
      {},
      { populate: ['competitionsCreated', 'teams'] }
    )
    res.status(200).json({ message: 'found all users', data: users })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const user = await em.findOneOrFail(
      User, 
      { id },
      { populate: ['competitionsCreated', 'teams'] }
    )
    res
      .status(200)
      .json({ message: 'found user', data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const user = em.create(User, req.body.sanitizedInput)
    await em.flush()
    res
      .status(201)
      .json({ message: 'user created', data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const user = em.getReference(User, id)
    em.assign(user, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'user updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const user = em.getReference(User, id)
    await em.removeAndFlush(user)
    res.status(200).send({ message: 'user deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeuserInput, findAll, findOne, add, update, remove }