import express, { Request, Response } from "express";
import pool from "../db";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const results = await pool.query(`
      SELECT u.id, u.nickname, r.name as role FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON r.id = ur.role_id;
  `);

    if (results.rowCount === 0) {
      res.status(404).json({
        message: "No users found!",
      });
    }

    res.status(200).json({
      status: 200,
      data: results.rows,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

export default router;
