import { app } from "../main";
import { request } from "supertest";

it("the status code of the response should be 400", async () => {
  const response = await request(app).post("/auth/signup").send({ username: null });
  console.log(response)
  expect(response.status).toBe(400)
});
