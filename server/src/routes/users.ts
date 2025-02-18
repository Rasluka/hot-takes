import express, { Request, Response } from "express";
import pool from "../db";

const router = express.Router();

// GetAll
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

//GetById
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.id;

    const results = await pool.query(
      `
      SELECT u.id, u.nickname, r.name as role FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1`,
      [userId]
    );

    if (results.rows.length > 0) {
      res.status(200).json({
        status: 200,
        data: results.rows[0],
      });
    } else {
      res.status(404).json({ status: 200, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

export default router;
