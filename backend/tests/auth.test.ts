import request from "supertest";
import bcrypt from "bcrypt";

import app from "../src/app";
import User from "../src/models/User";

describe("Authentication API", () => {

  beforeEach(async () => {

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

  });

  it("should login successfully with valid credentials", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "Admin@123",
      });

    expect(res.status).toBe(200);

    expect(res.body.message).toBe(
      "Login Successful"
    );

    expect(res.body.user.email).toBe(
      "admin@test.com"
    );

    expect(res.headers["set-cookie"]).toBeDefined();

  });

  it("should reject invalid password", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "WrongPassword",
      });

    expect(res.status).toBe(401);

    expect(res.body.message).toBe(
      "Invalid email or password"
    );

  });

  it("should reject invalid email", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@test.com",
        password: "Admin@123",
      });

    expect(res.status).toBe(401);

    expect(res.body.message).toBe(
      "Invalid email or password"
    );

  });

  it("should reject deactivated agent login", async () => {

    const password = await bcrypt.hash(
      "Agent@123",
      10
    );

    await User.create({
      name: "Agent",
      email: "agent@test.com",
      password,
      role: "agent",
      isActive: false,
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "agent@test.com",
        password: "Agent@123",
      });

    expect(res.status).toBe(403);

    expect(res.body.message).toContain(
      "deactivated"
    );

  });

  it("should logout successfully", async () => {

    const res = await request(app)
      .post("/api/auth/logout");

    expect(res.status).toBe(200);

    expect(res.body.message).toBe(
      "Logout Successful"
    );

  });

});