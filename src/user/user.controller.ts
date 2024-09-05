import { User } from './user.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const em = orm.em

function sanitizeuserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    //eliminé la contraseña para despues guardarla ya hasheada
    teams: req.body.teams,
    competitionsCreated: req.body.competitionsCreated,
  };


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
    res.status(200).json(users)
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
      .json(user)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function newUser(req:Request, res:Response) {
  try{
    const { userName, email } = req.body;

    //validamos si el usuario ya existe en la base de datos
    const existingUser = await em.findOne(User, { userName });
    if (existingUser) {
      return res
        .status(500)
        .json({ message: `El nombre de usuario ${userName} ya está en uso.` });
    }

    //validamos si el email ya existe en la base de datos
    const existingEmail = await em.findOne(User, { email });
    if (existingEmail) {
      return res
        .status(500)
        .json({ message: `El email ${email} ya está registrado.` });
    }

    // Si no existe, procedemos con la creación del usuario
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = em.create(User, {
      ...req.body.sanitizedInput,
      password: hashedPassword,
    });
    await em.flush();
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function loginUser(req: Request, res: Response) {
  const { userName, password } = req.body;
  //validamos si el usuario ya existe en la base de datos
  const existingUser: any = await em.findOne(User, { userName });
  if (!existingUser) {
    return res.status(500).json({ message: `No existe un usuario con el userName ${userName}` });
  }

  //validamos password
  const passwordValid = await bcrypt.compare(password, existingUser.password);
  if (!passwordValid){
    return res.status(500).json({ message: `Password Incorrecta` });
  }

  //generamos token
  const token = jwt.sign({ userName: userName }, process.env.SECRET_KEY || 'pepito123');
  res.json(token);
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const user = em.getReference(User, id)
    em.assign(user, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const user = em.getReference(User, id)
    await em.removeAndFlush(user)
    res.status(200).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeuserInput,
  findAll,
  findOne,
  newUser,
  loginUser,
  update,
  remove,
};