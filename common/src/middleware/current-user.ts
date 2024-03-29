/* MiddleWare to extract JWT payload and set it on req.currentUser */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface userPayload {
  id: string;
  email: string;
}

//to reach in an existing interface and add in a new field
declare global {
  namespace Express {
    interface Request {
      currentUser?: userPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as userPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
