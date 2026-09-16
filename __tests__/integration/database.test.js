import {
  startTestDatabase,
  stopTestDatabase,
} from "./testDatabase.js";

jest.setTimeout(120000);


describe("Test Database Connection", () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = await startTestDatabase();
  });

  afterAll(async () => {
    await stopTestDatabase();
  });

  it("should connect to PostgreSQL", async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });
});