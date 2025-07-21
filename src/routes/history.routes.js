import { Router } from "express";
import { createHistory, getHistory } from "../controller/history.controller.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";

const historyRouter = Router();

historyRouter.route("/watchHistory").post(authMiddleWare, createHistory);

historyRouter.route("/watchHistoryData").get(authMiddleWare, getHistory);

export default historyRouter;