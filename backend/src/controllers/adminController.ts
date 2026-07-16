import { Request, Response } from "express";
import bcrypt from "bcrypt";

import User from "../models/User";
import Customer from "../models/Customer";
import Policy from "../models/Policy";
import { handleError } from "../utils/handleError";

// ================= CREATE AGENT =================

const createAgent = async (req: Request, res: Response) => {
  try {

    const { name, email, password } = req.body;

    const existingAgent = await User.findOne({ email });

    if (existingAgent) {
      return res.status(400).json({
        message: "Agent already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "agent",
    });

    res.status(201).json({
      message: "Agent Created Successfully",
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        isActive: agent.isActive,
      },
    });

  } catch (error) {

    handleError(error, res);

  }
};

// ================= VIEW AGENTS =================

const getAgents = async (req: Request, res: Response) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      role: "agent",
    };

    if (req.query.status === "active") {
      filter.isActive = true;
    }

    if (req.query.status === "inactive") {
      filter.isActive = false;
    }

    const agents = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalAgents = await User.countDocuments(filter);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalAgents / limit),
      totalAgents,
      agents,
    });

  } catch (error) {

    handleError(error, res);

  }
};

// ================= AGENT PROFILE =================

const getAgentProfile = async (req: Request, res: Response) => {
  try {

    const agent = await User.findOne({
      _id: req.params.id,
      role: "agent",
    }).select("-password");

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    const customerCount = await Customer.countDocuments({
      agentId: agent._id,
    });

    const policyCount = await Policy.countDocuments({
      agentId: agent._id,
    });

    res.status(200).json({
      agent,
      summary: {
        customers: customerCount,
        policies: policyCount,
      },
    });

  } catch (error) {

    handleError(error, res);

  }
};

const activateAgent = async (req: Request, res: Response) => {
  try {

    const agent = await User.findOne({
      _id: req.params.id,
      role: "agent",
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    agent.isActive = true;

    await agent.save();

    res.status(200).json({
      message: "Agent Activated Successfully",
    });

  } catch (error) {
    handleError(error, res);
  }
};

const deactivateAgent = async (req: Request, res: Response) => {
  try {

    const agent = await User.findOne({
      _id: req.params.id,
      role: "agent",
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    agent.isActive = false;

    await agent.save();

    res.status(200).json({
      message: "Agent Deactivated Successfully",
    });

  } catch (error) {

    handleError(error, res);

  }
};

// ================= DASHBOARD STATS =================

const getDashboardStats = async (req: Request, res: Response) => {
  try {

    const totalAgents = await User.countDocuments({
      role: "agent",
    });

    const activeAgents = await User.countDocuments({
      role: "agent",
      isActive: true,
    });

    const inactiveAgents = await User.countDocuments({
      role: "agent",
      isActive: false,
    });

    const totalCustomers = await Customer.countDocuments();

    const totalPolicies = await Policy.countDocuments();

    res.status(200).json({
      totalAgents,
      activeAgents,
      inactiveAgents,
      totalCustomers,
      totalPolicies,
    });

  } catch (error) {

    handleError(error, res);

  }
};

export {
  createAgent,
  getAgents,
  getAgentProfile,
  activateAgent,
  deactivateAgent,
  getDashboardStats,
};