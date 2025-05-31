import express, { NextFunction, Request, Response } from "express";
import { authRouter } from "./routers/auth.router";
import { usersRouter } from "./routers/users.router";
import { taskRouter } from "./routers/task.router";
import { getConfigEnv, startDBConnection } from "./database/connection";
import { PORT } from "./types";
import helmet from "helmet";

const app = express();
app.use(helmet());
const PORT: PORT = getConfigEnv('PORT') || 3000;

startDBConnection()

app.use(express.json());
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/tasks', taskRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node.js!");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.log("ERROR-HERE 🤢🤢🤢", err?.message)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
