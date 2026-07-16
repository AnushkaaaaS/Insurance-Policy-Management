import {
  Request,
  Response,
  NextFunction,
} from "express";

const authorize =
  (...roles: string[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {

    const user = (req as any).user;

    if (!roles.includes(user.role)) {

      res.status(403).json({
        message: "Access Denied",
      });

      return;

    }

    next();

  };

export default authorize;