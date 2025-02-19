import express, { Request, Response } from "express";
import dbPool from "../db";
import { AuthService } from "../services/authService";
import { AuthController } from "../controllers/authController";
const jwtKey = process.env.JWT_SECRET || "";

const router = express.Router();
const authService = new AuthService(dbPool, jwtKey);
const authController = new AuthController(authService);

router.post("/signup", async (req: Request, res: Response) =>
  authController.signUp(req, res)
);

export default router;
