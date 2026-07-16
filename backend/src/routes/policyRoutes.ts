import express from "express";

import {
  getDashboardStats,
  issuePolicy,
  getPolicies,
  getPoliciesByCustomer,
  getPolicyById,
  updatePolicy,
} from "../controllers/policyController";

import authenticate from "../middlewares/authMiddleware";
import authorize from "../middlewares/roleMiddleware";

const router = express.Router();

router.post(
  "/issue",
  authenticate,
  authorize("agent"),
  issuePolicy
);

router.get(
  "/",
  authenticate,
  authorize("agent"),
  getPolicies
);

router.get(
  "/customer/:customerId",
  authenticate,
  authorize("agent"),
  getPoliciesByCustomer
);

router.get(
  "/dashboard",
  authenticate,
  authorize("agent"),
  getDashboardStats
);

router.get(
  "/:id",
  authenticate,
  authorize("agent"),
  getPolicyById
);

router.put(
  "/:id",
  authenticate,
  authorize("agent"),
  updatePolicy
);

export default router;