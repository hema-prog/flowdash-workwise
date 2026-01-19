/**
 * Central configuration file
 * Ensures all modules use the same constants
 */

export const JWT_SECRET = process.env.JWT_SECRET || "dev_default_jwt_secret_key_2024";
export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

console.log("✅ Config loaded:", {
  JWT_SECRET: JWT_SECRET ? "✓ Set" : "✗ Using fallback",
  BCRYPT_ROUNDS,
});
