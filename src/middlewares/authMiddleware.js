import jwt from "jsonwebtoken";
import { User } from "../model/userModel.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authMiddleWare = asyncHandler(async (req, res, next) => {
  const token = req.headers.token; 

  if (!token) {
    throw new ApiError("Unauthorized: Token missing", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError("Unauthorized: User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError("Unauthorized: Invalid token", 401);
  }
});

export default authMiddleWare;
