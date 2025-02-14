import express, { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Pool } from "pg";
import "dotenv/config";

const app = express();
const PORT = process.env.SERVER_PORT;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
});

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.post("/users", async (req: Request, res: Response) => {
  const { nickname, email } = req.body;

  if (!nickname || !email) {
    throw new Error("Nickname and email are required!");
  }

  const newCode = nanoid(8).toUpperCase();

  const query = `
    INSERT INTO users (email, nickname, code)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [email, nickname, newCode];

  try {
    const results = await pool.query(query, values);

    res.status(201).json({
      user: results.rows[0],
      signInCode: newCode,
      status: 201,
      message: "User created succesfully!",
    });
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === "23505") {
        // Unique violation error code
        res
          .status(400)
          .json({ error: "Email, nickname, or code already in use" });
      } else {
        res
          .status(500)
          .json({ error: "Internal server error", actualError: err });
      }
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
