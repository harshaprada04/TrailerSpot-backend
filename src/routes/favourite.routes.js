import { Router } from "express";
import {
  favouriteController,
  favouriteList,
  removeFromFavourites,
} from "../controller/favourite.controller.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";

const favRouter = Router();

favRouter.route("/favourites").post(authMiddleWare, favouriteController);
favRouter.route("/favouritesList").get(authMiddleWare, favouriteList);
favRouter
  .route("/favourites/:videoId")
  .delete(authMiddleWare, removeFromFavourites);

export default favRouter;
