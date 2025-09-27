import CryptoJS from "crypto-js";

async function hashPassword(plainPassword) {
  const saltRounds = 32;
  const hash = CryptoJS.SHA512(plainPassword + saltRounds).toString();
  return hash;
}

async function verifyPassword(inputPassword, storedHash) {
  const hashedPassword = await hashPassword(inputPassword);
  return hashedPassword === storedHash;
}

export { hashPassword, verifyPassword };
