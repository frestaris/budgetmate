import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
    }
    if (!token) {
      return next(errorHandler(401, "Unauthorized - No Token Provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return next(errorHandler(401, "Unauthorized - Invalid Token"));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Unexpected error in verifyToken", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};
