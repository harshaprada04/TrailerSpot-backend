import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../model/userModel.js";
import { Video } from "../model/videoModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const favouriteController = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const {
    id,
    original_title,
    name,
    overview,
    vote_average,
    isOriginal,
    image,
  } = req.body;

  // Validate all required fields
  const requiredFields = {
    id,
    original_title,
    name,
    overview,
    vote_average,
    isOriginal,
    image,
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === null || String(value).trim() === "") {
      throw new ApiError(`Field "${key}" is required`, 400);
    }
  }

  const currentUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!currentUser) {
    throw new ApiError("User not found", 404);
  }

  // Check if video exists, else create
  let video = await Video.findOne({ id });
  if (!video) {
    video = await Video.create({
      id,
      original_title,
      name,
      overview,
      vote_average,
      isOriginal,
      image,
    });
  }

  // Check if already in favourites
  const isMovieExists = currentUser.favouriteList?.some(
    (movieId) => movieId.toString() === video._id.toString()
  );

  if (isMovieExists) {
    throw new ApiError("Movie already exists in favourites", 400);
  }

  // Add to favourites
  currentUser.favouriteList.push(video._id);
  await currentUser.save({ validateModifiedOnly: true });

  return new ApiResponse(res).success(
    { favouriteList: currentUser.favouriteList },
    "Movie added to favourites successfully",
    201
  );
});


const favouriteList = asyncHandler(async(req,res,next)=>{
     const user = req.user; 

  const currentUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("favouriteList"); 

  if (!currentUser) {
    throw new ApiError("User not found", 404);
  }

  return new ApiResponse(res).success(
    { favourites: currentUser.favouriteList },
    "Fetched favourites successfully"
  );
})

const removeFromFavourites = asyncHandler(async (req, res) => {
  const user = req.user;
  const { videoId } = req.params; // This is the TMDB ID from frontend

  if (!videoId) {
    throw new ApiError("Video ID is required", 400);
  }

  // 1. Find the video by TMDB id
  const video = await Video.findOne({ id: videoId });

  if (!video) {
    throw new ApiError("Video not found in database", 404);
  }

  const currentUser = await User.findById(user._id);
  if (!currentUser) {
    throw new ApiError("User not found", 404);
  }

  const originalLength = currentUser.favouriteList.length;

  // 2. Remove video._id from user's favourites
  currentUser.favouriteList = currentUser.favouriteList.filter(
    (favId) => favId.toString() !== video._id.toString()
  );

  if (currentUser.favouriteList.length === originalLength) {
    throw new ApiError("Movie not found in favourites", 404);
  }

  await currentUser.save({ validateModifiedOnly: true });

  return new ApiResponse(res).success(
    { favouriteList: currentUser.favouriteList },
    "Movie removed from favourites successfully"
  );
});


export { favouriteController, favouriteList , removeFromFavourites};
