import express, { Request, Response } from "express";
import { nanoid } from "nanoid";

const app = express();
const PORT = 7000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.post("/users", (req: Request, res: Response) => {
  try {
    const { nickname, email } = req.body;

    if (!nickname || !email) {
      throw new Error("Nickname and email are required!");
    }

    const newCode = nanoid(8).toUpperCase();

    console.log(`Creating a new code for ${nickname}::: ${newCode}`);

    res.status(200).json({
      signInCode: newCode,
      status: 200,
      message: "User created succesfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
