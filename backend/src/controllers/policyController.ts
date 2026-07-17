import { Request, Response } from "express";
import mongoose from "mongoose";

import Policy from "../models/Policy";
import Customer from "../models/Customer";
import { handleError } from "../utils/handleError";

// ================= PII MASKING =================

const maskMobile = (mobile: string): string => {
  return mobile.replace(
    /^(\d{2})\d{6}(\d{2})$/,
    "$1XXXXXX$2"
  );
};

const maskAadhaar = (aadhaar: string): string => {
  return "XXXX-XXXX-" + aadhaar.slice(-4);
};

const maskPAN = (
  pan?: string | null
): string | null => {

  if (!pan) return null;

  return (
    pan.slice(0, 3) +
    "XX" +
    pan.slice(5, 7) +
    "XX" +
    pan.slice(9)
  );
};

const maskPolicy = (policy: any) => ({
  id: policy._id,
  policyType: policy.policyType,
  premium: policy.premium,
  policyTerm: policy.policyTerm,
  premiumFrequency:
    policy.premiumFrequency,
  startDate: policy.startDate,
  status: policy.status,

  customer: {
    id: policy.customerId._id,
    name: policy.customerId.name,
    mobile: maskMobile(
      policy.customerId.mobile
    ),
    aadhaar: maskAadhaar(
      policy.customerId.aadhaar
    ),
    pan: maskPAN(
      policy.customerId.pan
    ),
  },
});

// ================= DASHBOARD =================

export const getDashboardStats =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const userId = req.user.id;

      const totalCustomers =
        await Customer.countDocuments({
          agentId: userId,
        });

      const totalPolicies =
        await Policy.countDocuments({
          agentId: userId,
        });

      const activePolicies =
        await Policy.countDocuments({
          agentId: userId,
          status: "Active",
        });

      const cancelledPolicies =
        await Policy.countDocuments({
          agentId: userId,
          status: "Cancelled",
        });

      res.status(200).json({
        totalCustomers,
        totalPolicies,
        activePolicies,
        cancelledPolicies,
      });

    } catch (error: any) {

      handleError(error, res);

    }

  };

// ================= ISSUE POLICY =================

export const issuePolicy =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        customerId,
        policyType,
        premium,
        policyTerm,
        premiumFrequency,
        startDate,
      } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          customerId
        )
      ) {

        res.status(400).json({
          message:
            "Invalid Customer ID",
        });

        return;

      }

      const customer =
        await Customer.findOne({
          _id: customerId,
          agentId: req.user.id,
        });

      if (!customer) {

        res.status(404).json({
          message:
            "Customer not found",
        });

        return;

      }

const errors: Record<string, string> = {};

      if (
        premium > 50000 &&
        !customer.pan
      ) {

        errors.pan =
          "PAN is mandatory for premium greater than ₹50,000.";

      }

      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      if (
        new Date(startDate) < today
      ) {

        errors.startDate =
          "Start Date cannot be in the past.";

      }

     if (Object.keys(errors).length > 0) {

  if (errors.pan) {
    return res.status(400).json({
      message:
        "PAN is mandatory for policies with premium greater than ₹50,000. Please update the customer's PAN first.",
    });
  }

  return res.status(400).json({
    errors,
  });

}

      const policy =
        await Policy.create({
          customerId,
          agentId:
            req.user.id,
          policyType,
          premium,
          policyTerm,
          premiumFrequency,
          startDate,
        });

      const createdPolicy =
        await Policy.findById(
          policy._id
        ).populate(
          "customerId",
          "name mobile aadhaar pan"
        );

      res.status(201).json({
        message:
          "Policy Issued Successfully",
        policy: maskPolicy(
          createdPolicy
        ),
      });

    } catch (error: any) {

      handleError(error, res);

    }

  };
  // ================= GET ALL POLICIES =================

export const getPolicies = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const policies = await Policy.find({
      agentId: req.user.id,
    }).populate(
      "customerId",
      "name mobile aadhaar pan"
    );

    res.status(200).json({
      count: policies.length,
      policies: policies.map(maskPolicy),
    });

  } catch (error: any) {

    handleError(error, res);

  }

};

// ================= GET POLICIES OF CUSTOMER =================

export const getPoliciesByCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.customerId as string
      )
    ) {

      res.status(400).json({
        message: "Invalid Customer ID",
      });

      return;

    }

    const policies = await Policy.find({
      customerId: req.params.customerId,
      agentId: req.user.id,
    }).populate(
      "customerId",
      "name mobile aadhaar pan"
    );

    res.status(200).json({
      count: policies.length,
      policies: policies.map(maskPolicy),
    });

  } catch (error: any) {

    handleError(error, res);

  }

};

// ================= GET POLICY BY ID =================

export const getPolicyById = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {

      res.status(400).json({
        message: "Invalid Policy ID",
      });

      return;

    }

    const policy = await Policy.findOne({
      _id: req.params.id,
      agentId: req.user.id,
    }).populate(
      "customerId",
      "name mobile aadhaar pan"
    );

    if (!policy) {

      res.status(404).json({
        message: "Policy not found",
      });

      return;

    }

    res.status(200).json({
      policy: maskPolicy(policy),
    });

  } catch (error: any) {

    handleError(error, res);

  }

};

// ================= UPDATE POLICY =================

export const updatePolicy = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {

      res.status(400).json({
        message: "Invalid Policy ID",
      });

      return;

    }

    const {
      policyType,
      premium,
      policyTerm,
      premiumFrequency,
      startDate,
    } = req.body;

    const policy = await Policy.findOne({
      _id: req.params.id,
      agentId: req.user.id,
    });

    if (!policy) {

      res.status(404).json({
        message: "Policy not found",
      });

      return;

    }

    const customer = await Customer.findById(
      policy.customerId
    );

    const errors: Record<string, string> = {};

    if (
      premium > 50000 &&
      !customer?.pan
    ) {

      errors.pan =
        "PAN is mandatory for premium greater than ₹50,000.";

    }

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (
      new Date(startDate) < today
    ) {

      errors.startDate =
        "Start Date cannot be in the past.";

    }

    if (
      Object.keys(errors).length > 0
    ) {

      res.status(400).json({
        errors,
      });

      return;

    }

    policy.policyType = policyType;
    policy.premium = premium;
    policy.policyTerm = policyTerm;
    policy.premiumFrequency =
      premiumFrequency;
    policy.startDate = startDate;

    await policy.save();

    const updatedPolicy =
      await Policy.findById(
        policy._id
      ).populate(
        "customerId",
        "name mobile aadhaar pan"
      );

    res.status(200).json({
      message:
        "Policy Updated Successfully",
      policy: maskPolicy(
        updatedPolicy
      ),
    });

  } catch (error: any) {

    handleError(error, res);

  }

};