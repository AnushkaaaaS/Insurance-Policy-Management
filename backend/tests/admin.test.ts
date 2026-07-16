import request from "supertest";
import bcrypt from "bcrypt";

import app from "../src/app";
import User from "../src/models/User";
import { createAdminAndLogin } from "./testUtils";

describe("Admin API", () => {
  let cookie: string[];

  beforeEach(async () => {
    const { cookie: adminCookie } = await createAdminAndLogin();
    cookie = adminCookie;
  });

  it("should create a new agent", async () => {
    const res = await request(app)
      .post("/api/admin/agents")
      .set("Cookie", cookie)
      .send({
        name: "Test Agent",
        email: "agent@test.com",
        password: "Agent@123",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Agent Created Successfully");
    expect(res.body.agent.email).toBe("agent@test.com");
    expect(res.body.agent.password).toBeUndefined();
  });

  it("should reject creating an agent with a duplicate email", async () => {
    await User.create({
      name: "Existing Agent",
      email: "agent@test.com",
      password: await bcrypt.hash("Agent@123", 10),
      role: "agent",
      isActive: true,
    });

    const res = await request(app)
      .post("/api/admin/agents")
      .set("Cookie", cookie)
      .send({
        name: "Duplicate Agent",
        email: "agent@test.com",
        password: "Agent@123",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Agent already exists");
  });

  it("should fetch all agents", async () => {
    await User.create({
      name: "Agent",
      email: "agent@test.com",
      password: await bcrypt.hash("Agent@123", 10),
      role: "agent",
    });

    const res = await request(app).get("/api/admin/agents").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.agents.length).toBe(1);
  });

  it("should filter agents by active status", async () => {
    await User.create({
      name: "Active Agent",
      email: "active@test.com",
      password: await bcrypt.hash("Agent@123", 10),
      role: "agent",
      isActive: true,
    });

    await User.create({
      name: "Inactive Agent",
      email: "inactive@test.com",
      password: await bcrypt.hash("Agent@123", 10),
      role: "agent",
      isActive: false,
    });

    const res = await request(app)
      .get("/api/admin/agents?status=active")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.agents.length).toBe(1);
    expect(res.body.agents[0].email).toBe("active@test.com");
  });

  it("should deactivate an agent", async () => {
    const agent = await User.create({
      name: "Agent",
      email: "agent@test.com",
      password: await bcrypt.hash("Agent@123", 10),
      role: "agent",
    });

    const res = await request(app)
      .patch(`/api/admin/agents/${agent._id}/deactivate`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Agent Deactivated Successfully");
  });

  it("should activate an agent", async () => {
    const agent = await User.create({
      name: "Agent",
      email: "agent@test.com",
      password: await bcrypt.hash("Agent@123", 10),
      role: "agent",
      isActive: false,
    });

    const res = await request(app)
      .patch(`/api/admin/agents/${agent._id}/activate`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Agent Activated Successfully");
  });
});