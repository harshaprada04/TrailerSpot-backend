import { Router } from "express";
import {registerUser, loginUser, currentUserData} from "../controller/user.controller.js";
import authMiddleware from "../middlewares/authMiddleWare.js";

const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

//secured routes
router.route("/userData").get(authMiddleware,currentUserData);

export default router;