import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const { JWT_SECRET } = env;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization header missing",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        error: "Invalid authorization header",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (typeof decoded !== "object" || decoded.id == null) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    res.locals.userId = decoded.id;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
