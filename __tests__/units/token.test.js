import { generateTokens, verifyToken } from "../../utils/handleToken.js";
import dotenv from "dotenv";

dotenv.config();

describe("JWT Token Functions", () => {
  const payload = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    password: "hashedpassword",
    role: "admin",
  };

  let token;

  it("should generate a valid JWT token", () => {
    token = generateTokens(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should verify token and return the correct payload", () => {
    const decoded = verifyToken(token);

    expect(decoded.id).toBe(payload.id);
    expect(decoded.username).toBe(payload.username);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it("should throw error if token is invalid", () => {
    expect(() => verifyToken("invalid.token.here")).toThrow();
  });
});
