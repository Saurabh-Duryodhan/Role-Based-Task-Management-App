import express, { NextFunction, Request, Response } from "express";
import { authRouter } from "./routers/auth.router";
import { usersRouter } from "./routers/users.router";
import { taskRouter } from "./routers/task.router";
import { getConfigEnv, startDBConnection } from "./database/connection";
import { PORT } from "./types";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT: PORT = getConfigEnv('PORT')
// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing middleware
app.use(cookieParser());

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/tasks', taskRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node.js!");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

// Start server
const startServer = async () => {
    try {
        await startDBConnection();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
