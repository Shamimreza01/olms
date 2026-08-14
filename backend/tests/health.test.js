import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../models/setting.model.js", () => ({
  default: {
    findOne: vi.fn().mockResolvedValue({ maintenanceMode: false }),
  },
}));

import app from "../app.js";

describe("Health Check API Endpoint", () => {
  it("GET /api/health should return status OK and 200 status code", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("GET /api/nonexistent-route should return 404", async () => {
    const res = await request(app).get("/api/nonexistent-route");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "API route not found");
  });
});
