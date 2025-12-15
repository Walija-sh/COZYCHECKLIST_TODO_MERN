// Entry point
import express from 'express';
import 'dotenv/config';
import connectDb from './config/db.js';
import AuthRouter from './routes/authRoutes.js';
import TaskRouter from './routes/taskRoutes.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
const app = express();
const port = process.env.PORT || 3000;

// Connect to DB
connectDb();

// =======================
// Security Middlewares
// =======================

// 1. Set security headers
app.use(helmet());

// 2. Rate limiter (optional: only for auth routes if you want)
const limiter = rateLimit({
  max: 1000, // max requests
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// 3. Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? process.env.FRONTEND_DEV 
    : process.env.FRONTEND_PROD,
  credentials: true
}));

// 4. Body parsers
app.use(express.json());
app.use(cookieParser());

// 5. Data sanitization against NoSQL injection
// app.use(mongoSanitize());



// =======================
// Routes
// =======================
app.use('/api/auth', AuthRouter);
app.use('/api/tasks', TaskRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working"
  });
});

// =======================
// Global error handler
// =======================
app.use(globalErrorHandler);

// =======================
// Start server
// =======================
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
