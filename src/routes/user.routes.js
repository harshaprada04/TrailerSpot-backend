import { Router } from "express";
import {registerUser, loginUser, currentUserData} from "../controller/user.controller.js";
import authMiddleWare from "../middlewares/authMiddleWare.js";

const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

//secured routes
router.route("/userData").get(authMiddleWare,currentUserData);

export default router;