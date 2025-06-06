import { Request, Response, NextFunction } from "express";

export const checkAdmin = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Not an administrator.' });
  }
};