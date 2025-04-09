import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

interface JwtPayload{
  id: number;
  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  iconUrl?: string;
  competitionsCreated?: number[];
  teams?: number[];
  createdAt?: Date;
  updatedAt?: Date;
  role: 'user' | 'admin';
}

export const validateToken = (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => {
  const headerToken = req.headers['authorization'];

  if (headerToken !== undefined && headerToken.startsWith('Bearer')) {
    try {
      const bearerToken = headerToken.slice(7); 
      const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY || 'pepito123') as JwtPayload;

      req.user = decoded; 
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Access denied' });
  }
};