import request from "supertest";

import app from "../src/app";
import { createAdminAndLogin, createAgentAndLogin } from "./testUtils";

describe("Role-based access control", () => {
  describe("Unauthenticated requests", () => {
    it("should reject an unauthenticated request to an admin route", async () => {
      const res = await request(app).get("/api/admin/agents");
      expect(res.status).toBe(401);
    });

    it("should reject an unauthenticated request to an agent route", async () => {
      const res = await request(app).get("/api/customers");
      expect(res.status).toBe(401);
    });

    it("should reject a request with a garbage/invalid cookie", async () => {
      const res = await request(app)
        .get("/api/admin/agents")
        .set("Cookie", ["token=not-a-real-jwt"]);

      expect(res.status).toBe(401);
    });
  });

  describe("Cross-role access", () => {
    it("should stop an Agent from calling an Admin-only route", async () => {
      const { cookie } = await createAgentAndLogin();

      const res = await request(app).get("/api/admin/agents").set("Cookie", cookie);

      expect(res.status).toBe(403);
    });

    it("should stop an Admin from calling an Agent-only route", async () => {
      const { cookie } = await createAdminAndLogin();

      const res = await request(app).get("/api/customers").set("Cookie", cookie);

      expect(res.status).toBe(403);
    });

    it("should stop an Admin from issuing a policy", async () => {
      const { cookie } = await createAdminAndLogin();

      const res = await request(app)
        .post("/api/policies/issue")
        .set("Cookie", cookie)
        .send({
          customerId: "64b64c4f4f4f4f4f4f4f4f4f",
          policyType: "Life",
          premium: 25000,
          policyTerm: 20,
          premiumFrequency: "Yearly",
          startDate: "2030-01-01",
        });

      expect(res.status).toBe(403);
    });
  });

  describe("Deactivated accounts", () => {
    it("should stop a deactivated Agent from logging in and touching agent routes", async () => {
      const { agent } = await createAgentAndLogin({ email: "inactive-agent@test.com" });
      agent.isActive = false;
      await agent.save();

      const loginRes = await request(app).post("/api/auth/login").send({
        email: "inactive-agent@test.com",
        password: "Agent@123",
      });

      expect(loginRes.status).toBe(403);
      expect(loginRes.headers["set-cookie"]).toBeUndefined();
    });
  });
});