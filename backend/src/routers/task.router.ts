import { Request, Response, Router } from "express";
import { UserAccess } from "../middlewares/users.middleware";
import { TasksAccess } from "../middlewares/tasks.middleware";
const taskRouter = Router()

taskRouter.get('/', async (req: Request, res: Response): Promise<any> => {
    return res.status(200).send({ tasks: [] })
})

taskRouter.get('/:id', async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ requested_id: req.params.id, message: `Task : ${req.params.id}` })
})

taskRouter.post('/', TasksAccess, async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ success: "Task created successfully!" })
})

taskRouter.post('/:id/complete', UserAccess, async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ success: true, task: `${req.params.id} completed` })
})

export { taskRouter }