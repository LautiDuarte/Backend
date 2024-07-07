import express from 'express'
import { tipoJuegoRouter } from './tipoJuego/tipoJuego.routes.js'
import { newsRouter } from './news/news.routes.js'
import { regionRouter } from './region/region.routes.js'

const app = express()
app.use(express.json())

app.use('/api/tipoJuego', tipoJuegoRouter)
app.use('/api/news', newsRouter)
app.use('/api/region', regionRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})