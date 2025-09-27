import { hashPassword } from "../utils/handlePassword.js";

describe("User Service Unit Tests", () => {
  it("should hash password correctly", async () => {
    const password = "testPassword123";
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(10);
  });

  // Add other tests here...
});
