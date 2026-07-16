import mongoose from "mongoose";
import { Response } from "express";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string> = {};
    for (const key in error.errors) {
      errors[key] = error.errors[key].message;
    }
    return res.status(400).json({ errors });
  }

  if ((error as any)?.code === 11000) {
    const field = Object.keys((error as any).keyPattern || {})[0] || "field";
    return res.status(400).json({
      errors: { [field]: `${field} already exists.` },
    });
  }

  return res.status(500).json({
    message: error instanceof Error ? error.message : "Something went wrong",
  });
};