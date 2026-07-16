import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import customerRoutes from "./routes/customerRoutes";
import policyRoutes from "./routes/policyRoutes";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/policies", policyRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

export default app;