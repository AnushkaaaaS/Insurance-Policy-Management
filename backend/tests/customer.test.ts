import request from "supertest";

import app from "../src/app";
import Customer from "../src/models/Customer";
import { createAgentAndLogin } from "./testUtils";

describe("Customer API", () => {
  let cookie: string[];
  let agentId: string;

  beforeEach(async () => {
    const { cookie: agentCookie, agent } = await createAgentAndLogin();
    cookie = agentCookie;
    agentId = agent._id.toString();
  });

  it("should create a customer successfully", async () => {
    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", cookie)
      .send({
        name: "Rohan Sharma",
        age: 30,
        mobile: "9876543210",
        aadhaar: "123456789012",
        pan: "ABCDE1234F",
        nominee: "Anita Sharma",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Customer Created Successfully");
    expect(res.body.customer.pan).toBe("ABCXX12XXF");
    expect(res.body.customer.aadhaar).toBe("XXXX-XXXX-9012");
    expect(res.body.customer.mobile).toBe("98XXXXXX10");
  });

  it("should reject duplicate Aadhaar", async () => {
    await Customer.create({
      name: "Rohan",
      age: 30,
      mobile: "9999999999",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
      nominee: "Anita",
      agentId,
    });

    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", cookie)
      .send({
        name: "Rahul",
        age: 25,
        mobile: "8888888888",
        aadhaar: "123456789012",
        pan: "PQRSX1234Z",
        nominee: "Priya",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.aadhaar).toBeDefined();
  });

  it("should reject duplicate mobile number", async () => {
    await Customer.create({
      name: "Rohan",
      age: 30,
      mobile: "9876543210",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
      nominee: "Anita",
      agentId,
    });

    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", cookie)
      .send({
        name: "Rahul",
        age: 25,
        mobile: "9876543210",
        aadhaar: "999988887777",
        pan: "PQRSX1234Z",
        nominee: "Priya",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.mobile).toBeDefined();
  });

  it("should reject duplicate PAN", async () => {
    await Customer.create({
      name: "Rohan",
      age: 30,
      mobile: "9876543210",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
      nominee: "Anita",
      agentId,
    });

    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", cookie)
      .send({
        name: "Rahul",
        age: 25,
        mobile: "8888888888",
        aadhaar: "999988887777",
        pan: "ABCDE1234F",
        nominee: "Priya",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.pan).toBeDefined();
  });

  it("should reject when nominee is same as customer", async () => {
    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", cookie)
      .send({
        name: "Rohan",
        age: 30,
        mobile: "9999999999",
        aadhaar: "123456789012",
        pan: "ABCDE1234F",
        nominee: "Rohan",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.nominee).toBeDefined();
  });

  it("should reject age below 18 with a field-level error", async () => {
    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", cookie)
      .send({
        name: "Minor Person",
        age: 15,
        mobile: "9111111111",
        aadhaar: "111122223333",
        pan: "ABCDE1234F",
        nominee: "Guardian",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.age).toBeDefined();
  });

  it("should reject a malformed mobile number with a field-level error", async () => {
    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", cookie)
      .send({
        name: "Bad Mobile",
        age: 25,
        mobile: "1234567890", // must start with 6-9
        aadhaar: "111122223344",
        pan: "ABCDE1234F",
        nominee: "Someone",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.mobile).toBeDefined();
  });

  it("should reject a malformed Aadhaar with a field-level error", async () => {
    const res = await request(app)
      .post("/api/customers")
      .set("Cookie", cookie)
      .send({
        name: "Bad Aadhaar",
        age: 25,
        mobile: "9222222222",
        aadhaar: "12345", // must be exactly 12 digits
        pan: "ABCDE1234F",
        nominee: "Someone",
      });

    expect(res.status).toBe(400);
    expect(res.body.errors.aadhaar).toBeDefined();
  });

  it("should find a customer via search by name", async () => {
    await Customer.create({
      name: "Rohan Sharma",
      age: 30,
      mobile: "9876543210",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
      nominee: "Anita Sharma",
      agentId,
    });

    const res = await request(app)
      .get("/api/customers/search?q=Rohan")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.customers[0].name).toBe("Rohan Sharma");
  });

  it("should fetch a single customer by id", async () => {
    const customer = await Customer.create({
      name: "Rohan Sharma",
      age: 30,
      mobile: "9876543210",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
      nominee: "Anita Sharma",
      agentId,
    });

    const res = await request(app)
      .get(`/api/customers/${customer._id}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.customer.aadhaar).toBe("XXXX-XXXX-9012");
  });

  it("should update a customer successfully", async () => {
    const customer = await Customer.create({
      name: "Rohan Sharma",
      age: 30,
      mobile: "9876543210",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
      nominee: "Anita Sharma",
      agentId,
    });

    const res = await request(app)
      .put(`/api/customers/${customer._id}`)
      .set("Cookie", cookie)
      .send({
        name: "Rohan Sharma",
        age: 31,
        mobile: "9876543211",
        aadhaar: "123456789012",
        pan: "ABCDE1234F",
        nominee: "Sita Sharma",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Customer Updated Successfully");
  });

  it("should not let an Agent view another Agent's customer", async () => {
    const customer = await Customer.create({
      name: "Rohan Sharma",
      age: 30,
      mobile: "9876543210",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
      nominee: "Anita Sharma",
      agentId,
    });

    const { cookie: otherAgentCookie } = await createAgentAndLogin({
      email: "agent2@test.com",
    });

    const res = await request(app)
      .get(`/api/customers/${customer._id}`)
      .set("Cookie", otherAgentCookie);

    expect(res.status).toBe(404);
  });
});