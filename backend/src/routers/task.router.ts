import { Request, Response, Router } from "express";
import { UserAccess } from "../middlewares/users.middleware";
import { TasksAccess } from "../middlewares/tasks.middleware";
import { TasksService } from "../controllers/tasks.controller";


const taskRouter = Router()
const tasksService = new TasksService()

taskRouter.get('/', TasksAccess, async (req: Request, res: Response): Promise<any> => tasksService.getAllTasks(req, res))

taskRouter.get('/:id', async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ requested_id: req.params.id, message: `Task : ${req.params.id}` })
})

taskRouter.post('/', TasksAccess, async (req: Request, res: Response): Promise<any> => tasksService.createTask(req, res))

taskRouter.post('/:id/complete', UserAccess, async (req: Request, res: Response): Promise<any> => tasksService.completeTask(req, res))

taskRouter.delete('/:id', TasksAccess, async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ requested_id: req.params.id, message: `Task : ${req.params.id} deleted` })
})

export { taskRouter }