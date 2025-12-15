import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
    // Cookie options
    const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,                 // always true, no debate
  secure: isProduction,           // true only in production (HTTPS)
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',                      // always set this
};


// later implement cookies


const registerUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
        return next(new AppError('Please enter email and password for signup', 400));
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('User already exists', 400));
    }

    // 3. Create new user (hashing happens in model)
    const newUser = await User.create({ email, password });

    // 4. Generate token
    const token = generateToken(newUser._id);

// Send cookie
res.cookie('jwt', token, cookieOptions);


    // 5. Remove password before sending response
    const userData = newUser.toObject();
    delete userData.password;

    // 6. Response
    res.status(201).json({
        success: true,
        message: "User successfully created",
        token,
        user: userData
    });
});


const loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
        return next(new AppError('Please enter email and password to login', 400));
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) return next(new AppError('User does not exist', 400));

    // 3. Validate password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        return next(new AppError('Incorrect password', 400));
    }

    // 4. Generate token
    const token = generateToken(user._id);


// Send cookie
res.cookie('jwt', token, cookieOptions);


    // 5. Remove password from response
    const userData = user.toObject();
    delete userData.password;

    // 6. Response
    res.status(200).json({
        success: true,
        message: "User successfully authenticated",
        token,
        user: userData
    });
});

const getMe = catchAsync(async (req, res) => {

    
    res.status(200).json({
        success: true,
        user: req.user
    });
});

const logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
       secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  expires: new Date(0),
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

const updatePassword=catchAsync(async(req,res,next)=>{
 const {  oldPassword ,newPassword} = req.body;

    // 1. Validate input
    if (!oldPassword || !newPassword) {
        return next(new AppError('Please provide both old and new passwords', 400));
    }
     // 2. Find user
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User does not exist', 400));

    // 3. Validate password
    const isValidPassword = await user.comparePassword(oldPassword);
    if (!isValidPassword) {
        return next(new AppError('Incorrect password', 400));
    }

   user.password = newPassword;
await user.save();
// console.log(user);

    
    
     res.status(200).json({
        success: true,
        message: "Password successfully updated",
        
    });
})

export { registerUser, loginUser, getMe,logout,updatePassword };
