import bcrypt from "bcrypt";
import request from "supertest";

import app from "../src/app";
import User from "../src/models/User";

const normalizeCookie = (raw: string | string[] | undefined): string[] => {
  if (!raw) {
    throw new Error("Login did not return a set-cookie header — check credentials/isActive flag.");
  }
  return Array.isArray(raw) ? raw : [raw];
};

export const createAgentAndLogin = async (
  overrides: Partial<{ name: string; email: string; password: string }> = {}
) => {
  const email = overrides.email ?? "agent@test.com";
  const rawPassword = overrides.password ?? "Agent@123";
  const password = await bcrypt.hash(rawPassword, 10);

  const agent = await User.create({
    name: overrides.name ?? "Test Agent",
    email,
    password,
    role: "agent",
    isActive: true,
  });

  const res = await request(app).post("/api/auth/login").send({
    email,
    password: rawPassword,
  });

  return { cookie: normalizeCookie(res.headers["set-cookie"]), agent };
};

export const createAdminAndLogin = async (
  overrides: Partial<{ name: string; email: string; password: string }> = {}
) => {
  const email = overrides.email ?? "admin@test.com";
  const rawPassword = overrides.password ?? "Admin@123";
  const password = await bcrypt.hash(rawPassword, 10);

  const admin = await User.create({
    name: overrides.name ?? "Admin",
    email,
    password,
    role: "admin",
    isActive: true,
  });

  const res = await request(app).post("/api/auth/login").send({
    email,
    password: rawPassword,
  });

  return { cookie: normalizeCookie(res.headers["set-cookie"]), admin };
};