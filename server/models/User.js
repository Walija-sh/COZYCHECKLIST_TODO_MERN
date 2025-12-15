import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema=new mongoose.Schema({
email:{
    type:String,
    required: [true,'A user must have an email'],
     unique: true,
     lowercase: true
},
password:{
    type:String,
    required: [true,'A user must have a password'],
 
}
},{timestamps:true});

// Pre save hook
UserSchema.pre('save',async function(next) {
    if(!this.isModified('password')){
        return next();
    }

    try {
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error)
    }
})

// Instance method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  
  return await bcrypt.compare(candidatePassword,this.password); 
};

const User=mongoose.models.user || mongoose.model('User',UserSchema);




export default User;