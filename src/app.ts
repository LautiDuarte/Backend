import express from 'express'
import 'reflect-metadata'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { gameTypeRouter } from './gameType/gameType.routes.js'
import { newsRouter } from './news/news.routes.js'
import { regionRouter } from './region/region.routes.js'
import { inscriptionRouter } from './inscription/inscription.routes.js'
import { teamRouter } from './team/team.routes.js'
import { userRouter } from './user/user.routes.js'
import { competitionRouter } from './competition/competition.routes.js'
import { gameRouter } from './game/game.routes.js'
import { matchRouter } from './match/match.routes.js'
import cors from 'cors'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs';
import { fileURLToPath } from 'url';


const app = express()
app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const upload = multer({ storage });

app.use(upload.single('image'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use('/uploads', express.static(uploadsPath));

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/gameType', gameTypeRouter)
app.use('/api/news', newsRouter)
app.use('/api/region', regionRouter)
app.use('/api/inscription', inscriptionRouter)
app.use('/api/match', matchRouter)
app.use('/api/team', teamRouter)
app.use('/api/user', userRouter)
app.use('/api/competition', competitionRouter)
app.use('/api/game', gameRouter)


app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() // never in production

const PORT = process.env.PORT || 3000; // usa el puerto de Render o 3000 localmente
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})