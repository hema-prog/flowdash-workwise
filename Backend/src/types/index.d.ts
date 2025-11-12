import "express";

declare global {
  namespace Express {
    interface UserJWTPayload {
      id: string;
      role: "MANAGER" | "OPERATOR";
      email: string;
    }
    interface Request {
      user?: UserJWTPayload;
    }
  }
}
