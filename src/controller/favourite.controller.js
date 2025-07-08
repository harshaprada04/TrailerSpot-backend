import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../model/userModel.js";
import { Video } from "../model/videoModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const favouriteController = asyncHandler(async (req, res, next) => {
  // i need to check all these fields "adult" "backdrop_path" "id"  "original_language" "original_name"  "overview"  "popularity" "poster_path" "first_air_date" "name", "vote_average" "vote_count"
  // i need to check whether this movie already exists in the user database as favourite or not
  // if exists, return error

  const user = req.user;
  const {
    adult,
    backdrop_path,
    id,
    original_language,
    original_name,
    overview,
    popularity,
    poster_path,
    first_air_date,
    name,
    vote_average,
    vote_count,
  } = req.body;

  if (
    [
      backdrop_path,
      id,
      original_name,
      overview,
      popularity,
      poster_path,
      name,
      vote_average,
      vote_count,
    ].some((field) => field == " " || field == null)
  ) {
    throw new ApiError("All fields are required", 401);
  }

  const currentUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!currentUser) {
    throw new ApiError("User not found", 404);
  }

  let video = await Video.findOne({ id });

  if (!video) {
    video = await Video.create({
      adult,
      backdrop_path,
      id,
      original_language,
      original_name,
      overview,
      popularity,
      poster_path,
      first_air_date,
      name,
      vote_average,
      vote_count,
    });
  }

  const isMovieExists = currentUser.favouriteList?.some(
    (movieId) => movieId.toString() === video._id.toString()
  );
  if (isMovieExists) {
    throw new ApiError("Movie already exists in favourites", 400);
  }

  currentUser.favouriteList.push(video._id);
  await currentUser.save({ validateModifiedOnly: true });

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
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError("Video ID is required", 400);
  }

  const currentUser = await User.findById(user._id);
  if (!currentUser) {
    throw new ApiError("User not found", 404);
  }

  const originalLength = currentUser.favouriteList.length;

  // Remove the videoId if exists
  currentUser.favouriteList = currentUser.favouriteList.filter(
    (vid) => vid.toString() !== videoId.toString()
  );

  if (currentUser.favouriteList.length === originalLength) {
    throw new ApiError("Video not found in favourites", 404);
  }

  await currentUser.save({ validateModifiedOnly: true });

  return new ApiResponse(res).success(
    { favouriteList: currentUser.favouriteList },
    "Movie removed from favourites successfully"
  );
});

export { favouriteController, favouriteList , removeFromFavourites};
