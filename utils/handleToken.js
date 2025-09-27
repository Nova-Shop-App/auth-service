import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function generateTokens(payload) {
  return jwt.sign(
    {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { generateTokens, verifyToken };
