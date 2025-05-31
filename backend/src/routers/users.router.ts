import { Router } from "express";
import { AdminAccess } from "../middlewares/admin.middleware";
const usersRouter = Router();

usersRouter.get("/", AdminAccess, async (req, res): Promise<any> => {
    return res.status(200).send({ success: true, users: [] });
});

export { usersRouter }