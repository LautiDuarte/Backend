import { News } from './news.entity.js'
import { Request, Response, NextFunction } from 'express'
import { NewsRepository } from './news.repository.js'
import { title } from 'process'


const repository = new NewsRepository()

function sanitizenewsInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    title: req.body.title,
    body: req.body.body,
  }


  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() })
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id
  const news = await repository.findOne({ id })
  if (!news) {
    return res.status(404).send({ message: 'news not found' })
  }
  res.json({ data: news })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  
  const newsInput = new News(
    input.title,
    input.body
  )

  const news = repository.add(newsInput)
  return res.status(201).send({ message: 'news created', data: news })
}

async function update(req: Request, res: Response) {
  const news = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!news) {
    return res.status(404).send({ message: 'news not found' })
  }

  return res.status(200).send({ message: 'news updated successfully', data: news })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const news = await repository.delete({ id })

  if (!news) {
    res.status(404).send({ message: 'news not found' })
  } else {
    res.status(200).send({ message: 'news deleted successfully' })
  }
}

export { sanitizenewsInput, findAll, findOne, add, update, remove }