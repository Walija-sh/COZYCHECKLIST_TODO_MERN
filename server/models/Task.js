import mongoose, { Schema } from "mongoose";

const TaskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'A tast must have a title']
    },
    completed:{
        type:Boolean,
        default:false,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'], // Allowed string values
        default: 'low' // Optional: Set a default value
      },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true,'A task must have associated user id']
    }
},{timestamps:true});
TaskSchema.index({userId:1})
const Task=mongoose.models.task || mongoose.model('Task',TaskSchema);

export default Task;

// add stats later total,pending ,completed