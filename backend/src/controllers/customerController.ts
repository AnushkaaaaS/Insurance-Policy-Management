import { Request, Response } from "express";
import mongoose from "mongoose";

import Customer from "../models/Customer";
import { handleError } from "../utils/handleError";


// ================= PII MASKING =================


const maskMobile = (mobile: string): string => {
  return mobile.replace(/^(\d{2})\d{6}(\d{2})$/, "$1XXXXXX$2");
};

const maskAadhaar = (aadhaar: string): string => {
  return "XXXX-XXXX-" + aadhaar.slice(-4);
};

const maskPAN = (pan: string | null | undefined): string | null => {
  if (!pan) return null;
  return pan.slice(0, 3) + "XX" + pan.slice(5, 7) + "XX" + pan.slice(9);
};

const maskCustomer = (customer: any) => ({
  id: customer._id,
  name: customer.name,
  age: customer.age,
  mobile: maskMobile(customer.mobile),
  aadhaar: maskAadhaar(customer.aadhaar),
  pan: maskPAN(customer.pan),
  nominee: customer.nominee,
});

// ================= CREATE CUSTOMER =================

const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, age, mobile, aadhaar, pan, nominee } = req.body;
    const cleanedPAN = pan?.trim().toUpperCase();

    const errors: Record<string, string> = {};

    if (name.trim().toLowerCase() === nominee.trim().toLowerCase()) {
      errors.nominee = "Nominee cannot be the same as the policyholder.";
    }

    const aadhaarExists = await Customer.findOne({ aadhaar });

    if (aadhaarExists) {
      errors.aadhaar = "Aadhaar already exists.";
    }

    const mobileExists = await Customer.findOne({ mobile });

    if (mobileExists) {
      errors.mobile = "Mobile number already exists.";
    }

if (cleanedPAN) {
  const panExists = await Customer.findOne({ pan: cleanedPAN });

  if (panExists) {
    errors.pan = "PAN already exists.";
  }
}

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors,
      });
    }

const customerData: any = {
  name,
  age,
  mobile,
  aadhaar,
  nominee,
  agentId: req.user.id,
};

if (cleanedPAN) {
  customerData.pan = cleanedPAN;
}

const customer = await Customer.create(customerData);

    res.status(201).json({
      message: "Customer Created Successfully",
      customer: maskCustomer(customer),
    });

  } catch (error) {
    handleError(error, res);
  }
};

// ================= GET ALL CUSTOMERS =================

const getCustomers = async (req: Request, res: Response) => {
  try {

    const customers = await Customer.find(
      { agentId: req.user.id },
      "name age mobile aadhaar pan nominee"
    );

    res.status(200).json({
      count: customers.length,
      customers: customers.map(maskCustomer),
    });

  } catch (error) {
    handleError(error, res);
  }
};

// ================= SEARCH CUSTOMERS =================

const searchCustomers = async (req: Request, res: Response) => {
  try {

    const q = (req.query.q as string) || "";

    const customers = await Customer.find({
      agentId: req.user.id,
      $or: [
        {
          name: {
            $regex: q,
            $options: "i",
          },
        },
        {
          mobile: {
            $regex: q,
          },
        },
        {
          aadhaar: {
            $regex: q,
          },
        },
      ],
    });

    res.status(200).json({
      count: customers.length,
      customers: customers.map(maskCustomer),
    });

  } catch (error) {
    handleError(error, res);
  }
};

// ================= GET CUSTOMER BY ID =================

const getCustomerById = async (req: Request, res: Response) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
      return res.status(400).json({
        message: "Invalid Customer ID",
      });
    }

    const customer = await Customer.findOne(
      {
        _id: req.params.id,
        agentId: req.user.id,
      },
      "name age mobile aadhaar pan nominee"
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer: maskCustomer(customer),
    });

  } catch (error) {
    handleError(error, res);
  }
};

const getCustomerForEdit = async (req: Request, res: Response) => {
  try {

    const customer = await Customer.findOne({
      _id: req.params.id,
      agentId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer: {
        id: customer._id,
        name: customer.name,
        age: customer.age,
        mobile: customer.mobile,
        aadhaar: customer.aadhaar,
        pan: customer.pan,
        nominee: customer.nominee,
      },
    });

  } catch (error) {

    handleError(error, res);

  }
};

// ================= UPDATE CUSTOMER =================

const updateCustomer = async (req: Request, res: Response) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
      return res.status(400).json({
        message: "Invalid Customer ID",
      });
    }

    const { name, age, mobile, aadhaar, pan, nominee } = req.body;
    const cleanedPAN = pan?.trim().toUpperCase();

    const customer = await Customer.findOne({
      _id: req.params.id,
      agentId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const errors: Record<string, string> = {};

    if (name.trim().toLowerCase() === nominee.trim().toLowerCase()) {
      errors.nominee = "Nominee cannot be the same as the policyholder.";
    }

    const existingMobile = await Customer.findOne({
      mobile,
      _id: { $ne: req.params.id },
    });

    if (existingMobile) {
      errors.mobile = "Mobile number already exists.";
    }

    const existingAadhaar = await Customer.findOne({
      aadhaar,
      _id: { $ne: req.params.id },
    });

    if (existingAadhaar) {
      errors.aadhaar = "Aadhaar already exists.";
    }

if (cleanedPAN) {
  const existingPAN = await Customer.findOne({
    pan: cleanedPAN,
    _id: { $ne: req.params.id },
  });

  if (existingPAN) {
    errors.pan = "PAN already exists.";
  }
}

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors,
      });
    }

customer.name = name;
customer.age = age;
customer.mobile = mobile;
customer.aadhaar = aadhaar;
customer.nominee = nominee;

if (cleanedPAN) {
  customer.pan = cleanedPAN;
} else {
  customer.pan = undefined;
}

    await customer.save();

    res.status(200).json({
      message: "Customer Updated Successfully",
      customer: maskCustomer(customer),
    });

  } catch (error) {
    handleError(error, res);
  }
};

export {
  createCustomer,
  getCustomers,
  searchCustomers,
  getCustomerById,
  getCustomerForEdit,
  updateCustomer,
};