import express, { Request, Response } from "express";
import pool from "../db";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { nickname, email } = req.body;

  if (!email || !nickname) {
    res.status(400).json({ error: "Email and nickname are required" });
  }

  const newCode = nanoid(8).toUpperCase();

  try {
    const queryResults = await pool.query(
      "INSERT INTO users (email, nickname, code) VALUES ($1, $2, $3) RETURNING *;",
      [email, nickname, newCode]
    );

    // We get the id of the newly created user to later assign the 'taker' role.
    const newUserId = queryResults.rows[0].id;

    await pool.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
      [newUserId, 1]
    );

    await pool.query("COMMIT");

    res.status(201).json({
      user: queryResults.rows[0],
      status: 201,
      message: "User created succesfully!",
    });
  } catch (err) {
    await pool.query("ROLLBACK");

    if (err instanceof Error && "code" in err) {
      if (err.code === "23505") {
        // Unique violation error code
        res
          .status(400)
          .json({ error: "Email, nickname, or code already in use" });
      } else {
        res
          .status(500)
          .json({ message: "Internal server error", actualError: err });
      }
    } else {
      res
        .status(500)
        .json({ message: "An unknown error occurred", error: err });
    }
  }
});

export default router;
