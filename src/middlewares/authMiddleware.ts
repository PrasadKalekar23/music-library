import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({
      status: 401,
      data: null,
      message: 'Unauthorized Access',
      error: null,
    });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({
      status: 403,
      data: null,
      message: 'Invalid Token',
      error: error.stack,
    });
  }
};
