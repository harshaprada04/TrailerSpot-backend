import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors(
    {origin: process.env.CORS_ORIGIN || '*',
        credentials : true, 
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }
));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

import userRoutes from './routes/user.routes.js';
import ApiError from './utils/ApiError.js';

app.use("/api/v1/users", userRoutes);


app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      data: err.data || null
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    data: null
  });
});

export default app;