import express from 'express'
import 'reflect-metadata'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { gameTypeRouter } from './gameType/gameType.routes.js'
import { newsRouter } from './news/news.routes.js'
import { regionRouter } from './region/region.routes.js'
import { inscriptionsRouter } from './inscription/inscription.routes.js'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/gameType', gameTypeRouter)
app.use('/api/news', newsRouter)
app.use('/api/region', regionRouter)
app.use('/api/inscription', inscriptionsRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() // never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})