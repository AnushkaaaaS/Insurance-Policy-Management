import express from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  getCustomerForEdit,
  updateCustomer,
  searchCustomers,
} from "../controllers/customerController";

import authenticate from "../middlewares/authMiddleware";
import authorize from "../middlewares/roleMiddleware";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("agent"),
  createCustomer
);

router.get(
  "/search",
  authenticate,
  authorize("agent"),
  searchCustomers
);

router.get(
  "/",
  authenticate,
  authorize("agent"),
  getCustomers
);

router.get(
  "/:id/edit",
  authenticate,
  authorize("agent"),
  getCustomerForEdit
);

router.get(
  "/:id",
  authenticate,
  authorize("agent"),
  getCustomerById
);

router.put(
  "/:id",
  authenticate,
  authorize("agent"),
  updateCustomer
);

export default router;