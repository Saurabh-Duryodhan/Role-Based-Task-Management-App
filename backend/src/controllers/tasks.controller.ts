import { Request, Response } from 'express';
import { ITask, Tasks } from '../models/tasks.model';
export class TasksService {
    constructor() { }

    createTask = async (req: Request, res: Response): Promise<ITask | Response> => {
        try {
            const newTasks = await Tasks.create(req.body)
            console.log('newTasks: ', newTasks);
            return res.status(201).json(newTasks)
        } catch (error) {
            console.error('Error creating task:', error);
            return res.status(500).json({ error: 'Failed to create task' });
        }
    }

    completeTask = async (req: Request, res: Response): Promise<Response | ITask> => {
        try {
            const completedTask = await Tasks.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: "completed" } }, { new: true });
            return res.status(200).json(completedTask);
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({ error: 'Failed to complete task' });
        }
    }

    getAllTasks = async (req: Request, res: Response): Promise<Response> => {
        try {
            const tasks = await Tasks.find({}).lean();
            return res.status(200).json({ tasks });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    }

    deleteTask = async (req: Request, res: Response) => {
        try {
            const deletedTask = await Tasks.findByIdAndDelete({ _id: req.params.id });
            if (!deletedTask) {
                return res.status(404).json({ error: 'Task not found' });
            }
            return res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
        } catch (error) {
            console.error('Error deleting task:', error);
            return res.status(500).json({ error: 'Failed to delete task' });
        }
    }

}