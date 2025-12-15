import express from 'express';
import { createTask,getTasks,getTask,updateTask,deleteTask,getTaskStats } from '../controllers/taskController.js';
import protect from '../middleware/protect.js';

const TaskRouter=express.Router();
TaskRouter.use(protect)

TaskRouter.post('/',createTask);
TaskRouter.get('/',getTasks);
TaskRouter.get('/stats',getTaskStats);
TaskRouter.get('/:id',getTask);
TaskRouter.put('/:id',updateTask);
TaskRouter.delete('/:id',deleteTask);


export default TaskRouter;