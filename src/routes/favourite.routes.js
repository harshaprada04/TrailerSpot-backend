import { Router } from "express";
import {favouriteController, favouriteList, removeFromFavourites} from "../controller/favourite.controller.js";
import authMiddleware from "../middlewares/authMiddleWare.js";

const favRouter = Router();

favRouter.route("/favourites").post(authMiddleware,favouriteController);
favRouter.route("/favouritesList").get(authMiddleware,favouriteList);
favRouter.route("/favourites/:videoId").delete(authMiddleware,removeFromFavourites);

export default favRouter;