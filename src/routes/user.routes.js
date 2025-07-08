import { Router } from "express";
import {
  registerUser,
  loginUser,
  currentUserData,
} from "../controller/user.controller.js";


const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

//secured routes
import authMiddleWare from "../middleWare/authMiddleWare.js";

router.route("/userData").get(authMiddleWare, currentUserData);

export default router;
