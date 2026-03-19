// 1. Imports
const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../models/User");

let mongoServer;


// 2. Setup (runs once)
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});


// 3. Cleanup after each test
afterEach(async () => {
  await User.deleteMany();
});


// 4. Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Group: Create User API
describe("POST /api/users", () => {

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        username: "rupali",
        email: "rupali@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should fail if email already exists", async () => {
    await User.create({
      username: "test",
      email: "test@test.com",
      password: "hashed"
    });

    const res = await request(app)
      .post("/api/users")
      .send({
        username: "test2",
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
  });

  it("should fail for invalid email", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        username: "test",
        email: "invalid",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
  });

});


// Group: Get User API
describe("GET /api/users/:id", () => {

  it("should return user with valid token", async () => {
    const createRes = await request(app)
      .post("/api/users")
      .send({
        username: "rupali",
        email: "rupali@test.com",
        password: "123456"
      });

    const token = createRes.body.token;
    const user = await User.findOne({ email: "rupali@test.com" });

    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe("rupali@test.com");
  });

  it("should fail without token", async () => {
    const user = await User.create({
      username: "test",
      email: "test@test.com",
      password: "hashed"
    });

    const res = await request(app)
      .get(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(401);
  });

});

// Group: Login User API
describe("POST /api/login", () => {

  it("should login successfully with valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      username: "rupali",
      email: "rupali@test.com",
      password: hashedPassword
    });

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "rupali@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });


  it("should fail if user does not exist", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "notfound@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });


  it("should fail for wrong password", async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      username: "rupali",
      email: "rupali@test.com",
      password: hashedPassword
    });

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "rupali@test.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });


  it("should fail for invalid email format", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "invalid-email",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
  });


  it("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "rupali@test.com"
      });

    expect(res.statusCode).toBe(400);
  });

});
