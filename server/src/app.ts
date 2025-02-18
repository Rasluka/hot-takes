import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth";
import usersRouter from "./routes/userRoutes";

const app = express();
app.use(express.json());

// Mounting the routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
