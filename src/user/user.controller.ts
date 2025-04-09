import { User } from './user.entity.js'
import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { sendEmail } from '../services/emailService.js';
import crypto from 'crypto';

const em = orm.em

function sanitizeuserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    teams: req.body.teams,
    competitionsCreated: req.body.competitionsCreated,
    iconUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    role: req.body.role
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
      { populate: [/*'competitionsCreated',*/ 'teams'] }
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
    const existingUser = await em.findOne(User, { userName });
    if (existingUser) {
      return res
        .status(500)
        .json({ message: `El nombre de usuario ${userName} ya está en uso.` });
    }
    const existingEmail = await em.findOne(User, { email });
    if (existingEmail) {
      return res
        .status(500)
        .json({ message: `El email ${email} ya está registrado.` });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = em.create(User, {
      ...req.body.sanitizedInput,
      password: hashedPassword,
    });
    await em.flush();

    //email bienvenida
    await sendEmail(
      email,
      'Bienvenido a la plataforma de E-Sports',
      `Hola ${userName}, bienvenido a la plataforma de E-Sports. Estamos encantados de tenerte con nosotros.`
    );

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function loginUser(req: Request, res: Response) {
  const { userName, password } = req.body;
  const existingUser: any = await em.findOne(User, { userName });
  if (!existingUser) {
    return res.status(500).json({ message: `No existe un usuario con el userName ${userName}` });
  }
  const passwordValid = await bcrypt.compare(password, existingUser.password);
  if (!passwordValid){
    return res.status(500).json({ message: `Password Incorrecta` });
  }
  const token = jwt.sign({ id:existingUser.id, userName: userName, role: existingUser.role}, process.env.SECRET_KEY || 'pepito123');
  res.json(token);
}

async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await em.findOne(User, { email });

    if (!user) {
      return res.status(404).json({ message: 'No existe un usuario con ese email' });
    }

    // generamos token de recuperacion
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiresAt;
    await em.flush();
    
    // enviar email con el token
    const resetUrl = `http://localhost:4200/reset-password?token=${token}`;
    await sendEmail(
      email,
      'Recuperación de contraseña',
      `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar: ${resetUrl}`
    );

    res.status(200).json({ message: 'Email de recuperación enviado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;
    // Buscar el usuario con el token y que la fecha de expiración no haya pasado
    const user = await em.findOne(User, { resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });

    if (!user) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado' });
    }

    //guardar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;  // Limpiamos el token
    user.resetPasswordExpires = undefined;  // Limpiamos la fecha de expiración del token
    await em.flush();

    res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error: any) { 
    res.status(500).json({ message: error.message });
  } 
 }

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const { userName, email } = req.body.sanitizedInput;
    const existingUsername = await em.findOne(User, { userName });
    if (existingUsername && existingUsername.id !== id) {
    return res.status(400).json({ message: 'Username already exists' });
    }
    const existingEmail = await em.findOne(User, { email });
    if (existingEmail && existingEmail.id !== id) {
    return res.status(400).json({ message: 'Email already exists' });
    }
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
  forgotPassword,
  resetPassword
};