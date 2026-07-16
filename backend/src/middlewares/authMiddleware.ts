import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const token = req.cookies.token;

  if (!token) {

    res.status(401).json({
      message: "Please login first",
    });

    return;

  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    (req as any).user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid or Expired Token",
    });

  }

};

export default authenticate;