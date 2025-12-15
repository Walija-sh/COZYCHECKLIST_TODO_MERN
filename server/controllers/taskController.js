import mongoose from "mongoose";
import Task from "../models/Task.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const createTask=catchAsync(
    async(req,res,next)=>{
    //1. Extract data from req.body (title, priority, completed status).
    const {title,priority,completed}=req.body;
    const newTask={
        title,
        priority,
        completed ,
        userId:req.user._id
    }

// Save task to the database.
const task=await Task.create(newTask);

res.status(201).json({
    success:true,
    message:"Task created successfully",
    task
})

}

)
const getTasks=catchAsync(async(req,res,next)=>{
    const tasks=await Task.find({userId:req.user._id})
res.status(200).json({
    success:true,
    length:tasks.length,
    tasks
})
})
const getTask=catchAsync(
    async(req,res,next)=>{

    const task=await Task.findById(req.params.id).select('-__v');

    if(!task){
        return next(new AppError("Bad request",400))
    }

    if(task.userId.toString() !== req.user._id.toString()){
         return next(new AppError("Forbidden",403))
    }
res.status(200).json({
    success:true,
    message:"Task fetched successfully",
    task
})

}
)
const updateTask=catchAsync(async(req,res,next)=>{
    const { id } = req.params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid task ID.', 400));
    }

    // 2. Fetch task
    const task = await Task.findById(id);
    if (!task) {
        return next(new AppError('Task not found.', 404));
    }
     // 3. Ownership check
    if (task.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to update this task.', 403));
    }

    // 4. Build dynamic update object
    const updateObj = {};
    const allowedFields = ['title', 'priority', 'completed'];

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateObj[field] = req.body[field];
        }
    });

    // If user sent nothing
    if (Object.keys(updateObj).length === 0) {
        return next(new AppError('No fields provided for update.', 400));
    }

    // 5. Update + validate
    const updatedTask = await Task.findByIdAndUpdate(id, updateObj, {
        new: true,
        runValidators: true
    });

    // 6. Response
    res.status(200).json({
        success: true,
        message: 'Task updated successfully.',
        task: updatedTask
    });
})
const deleteTask = catchAsync(
    async (req, res, next) => {
    const { id } = req.params;

    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid task ID.', 400));
    }

    // 2. Fetch task
    const task = await Task.findById(id);
    if (!task) {
        return next(new AppError('Task not found.', 404));
    }

    // 3. Ownership check
    if (task.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to delete this task.', 403));
    }

    // 4. Delete
    await Task.findByIdAndDelete(id);

    // 5. Response (no body for 204)
    res.status(204).send();
}
)
const getTaskStats = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const stats = await Task.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(userId) }
        },
        {
            $facet: {
                overallStats: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            completed: {
                                $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
                            },
                            pending: {
                                $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] }
                            }
                        }
                    }
                ],
                priorityStats: [
                    {
                        $group: {
                            _id: "$priority",
                            total: { $sum: 1 },
                            completed: {
                                $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
                            },
                            pending: {
                                $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] }
                            }
                        }
                    }
                ]
            }
        }
    ]);

    // Handle case where user has no tasks
    const overall = stats[0].overallStats[0] || { total: 0, completed: 0, pending: 0 };
    const priority = stats[0].priorityStats || [];

    res.status(200).json({
        success: true,
        message: "Task stats fetched successfully",
        stats: {
            overall,
            priority
        }
    });
});

export {createTask,getTasks,getTask,updateTask,deleteTask,getTaskStats}