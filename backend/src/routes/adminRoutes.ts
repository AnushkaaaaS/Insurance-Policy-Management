import express from "express";

import {
  createAgent,
  getAgents,
  getAgentProfile,
  activateAgent,
  deactivateAgent,
  getDashboardStats,
} from "../controllers/adminController";

import authenticate from "../middlewares/authMiddleware";
import authorize from "../middlewares/roleMiddleware";

const router = express.Router();

router.post(
  "/agents",
  authenticate,
  authorize("admin"),
  createAgent
);

router.get(
  "/agents",
  authenticate,
  authorize("admin"),
  getAgents
);

router.get(
  "/agents/:id",
  authenticate,
  authorize("admin"),
  getAgentProfile
);

router.patch(
  "/agents/:id/deactivate",
  authenticate,
  authorize("admin"),
  deactivateAgent
);

router.patch(
  "/agents/:id/activate",
  authenticate,
  authorize("admin"),
  activateAgent
);

router.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  getDashboardStats
);

export default router;