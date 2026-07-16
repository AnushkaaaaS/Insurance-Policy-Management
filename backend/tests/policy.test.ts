import request from "supertest";

import app from "../src/app";
import Customer from "../src/models/Customer";
import Policy from "../src/models/Policy";
import { createAgentAndLogin } from "./testUtils";

describe("Policy API", () => {
  let cookie: string[];
  let agentId: string;
  let customerId: string;

  beforeEach(async () => {
    const { cookie: agentCookie, agent } = await createAgentAndLogin();
    cookie = agentCookie;
    agentId = agent._id.toString();

    const customer = await Customer.create({
      name: "Rohan Sharma",
      age: 30,
      mobile: "9876543210",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
      nominee: "Anita Sharma",
      agentId,
    });

    customerId = customer._id.toString();
  });

  it("should issue a policy successfully", async () => {
    const res = await request(app)
      .post("/api/policies/issue")
      .set("Cookie", cookie)
      .send({
        customerId,
        policyType: "Life",
        premium: 25000,
        policyTerm: 20,
        premiumFrequency: "Yearly",
        startDate: "2030-01-01",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Policy Issued Successfully");
    expect(res.body.policy.customer.aadhaar).toBe("XXXX-XXXX-9012");
    expect(res.body.policy.customer.pan).toBe("ABCXX12XXF");
  });

  it("should reject premium greater than ₹50,000 without PAN", async () => {
    const customer = await Customer.findById(customerId);
    if (customer) {
      customer.pan = undefined;
      await customer.save();
    }

    const res = await request(app)
      .post("/api/policies/issue")
      .set("Cookie", cookie)
      .send({
        customerId,
        policyType: "Life",
        premium: 60000,
        policyTerm: 20,
        premiumFrequency: "Yearly",
        startDate: "2030-01-01",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.pan).toBeDefined();
  });

  it("should reject past start date", async () => {
    const res = await request(app)
      .post("/api/policies/issue")
      .set("Cookie", cookie)
      .send({
        customerId,
        policyType: "Life",
        premium: 25000,
        policyTerm: 20,
        premiumFrequency: "Yearly",
        startDate: "2020-01-01",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.startDate).toBeDefined();
  });

  it("should reject issuing a policy for a customer that does not belong to the agent", async () => {
    const { cookie: otherAgentCookie } = await createAgentAndLogin({
      email: "agent2@test.com",
    });

    const res = await request(app)
      .post("/api/policies/issue")
      .set("Cookie", otherAgentCookie)
      .send({
        customerId,
        policyType: "Life",
        premium: 25000,
        policyTerm: 20,
        premiumFrequency: "Yearly",
        startDate: "2030-01-01",
      });

    expect(res.status).toBe(404);
  });

  it("should update a policy successfully", async () => {
    const policy = await Policy.create({
      customerId,
      agentId,
      policyType: "Life",
      premium: 25000,
      policyTerm: 20,
      premiumFrequency: "Yearly",
      startDate: new Date("2030-01-01"),
    });

    const res = await request(app)
      .put(`/api/policies/${policy._id}`)
      .set("Cookie", cookie)
      .send({
        policyType: "Health",
        premium: 30000,
        policyTerm: 25,
        premiumFrequency: "Monthly",
        startDate: "2030-02-01",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Policy Updated Successfully");
  });

  it("should not let an Agent update another Agent's policy", async () => {
    const policy = await Policy.create({
      customerId,
      agentId,
      policyType: "Life",
      premium: 25000,
      policyTerm: 20,
      premiumFrequency: "Yearly",
      startDate: new Date("2030-01-01"),
    });

    const { cookie: otherAgentCookie } = await createAgentAndLogin({
      email: "agent2@test.com",
    });

    const res = await request(app)
      .put(`/api/policies/${policy._id}`)
      .set("Cookie", otherAgentCookie)
      .send({
        policyType: "Health",
        premium: 30000,
        policyTerm: 25,
        premiumFrequency: "Monthly",
        startDate: "2030-02-01",
      });

    expect(res.status).toBe(404);
  });

  it("should list policies issued by the logged-in agent only", async () => {
    await Policy.create({
      customerId,
      agentId,
      policyType: "Life",
      premium: 25000,
      policyTerm: 20,
      premiumFrequency: "Yearly",
      startDate: new Date("2030-01-01"),
    });

    const res = await request(app).get("/api/policies").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it("should list policies for a specific customer", async () => {
    await Policy.create({
      customerId,
      agentId,
      policyType: "Life",
      premium: 25000,
      policyTerm: 20,
      premiumFrequency: "Yearly",
      startDate: new Date("2030-01-01"),
    });

    const res = await request(app)
      .get(`/api/policies/customer/${customerId}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it("should reject premium below ₹5,000 with a field-level error", async () => {
    const res = await request(app)
      .post("/api/policies/issue")
      .set("Cookie", cookie)
      .send({
        customerId,
        policyType: "Life",
        premium: 1000,
        policyTerm: 20,
        premiumFrequency: "Yearly",
        startDate: "2030-01-01",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.premium).toBeDefined();
  });

  it("should reject an invalid policy term with a field-level error", async () => {
    const res = await request(app)
      .post("/api/policies/issue")
      .set("Cookie", cookie)
      .send({
        customerId,
        policyType: "Life",
        premium: 25000,
        policyTerm: 12, // not one of 10/15/20/25/30
        premiumFrequency: "Yearly",
        startDate: "2030-01-01",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.policyTerm).toBeDefined();
  });

  it("should reject an invalid premium frequency with a field-level error", async () => {
    const res = await request(app)
      .post("/api/policies/issue")
      .set("Cookie", cookie)
      .send({
        customerId,
        policyType: "Life",
        premium: 25000,
        policyTerm: 20,
        premiumFrequency: "Weekly", // not a valid enum value
        startDate: "2030-01-01",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.premiumFrequency).toBeDefined();
  });
});