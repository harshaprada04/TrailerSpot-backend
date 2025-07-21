import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../model/userModel.js";
import { Video } from "../model/videoModel.js";
import ApiResponse from "../utils/ApiResponse.js";

const createHistory = asyncHandler(async (req, res) => {
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


  const isMovieExists = currentUser.watchHistory?.some(
      (movieId) => movieId.toString() === video._id.toString()
    );
  
    
    if (isMovieExists) {
      let updatedHistory = currentUser.watchHistory.filter(
        (movieId) => movieId.toString() !== video._id.toString() )
        
        currentUser.watchHistory = updatedHistory;
        currentUser.watchHistory.push(video._id);
        currentUser.watchHistory.slice(-9); 
        await currentUser.save({ validateModifiedOnly: true });  
        return new ApiResponse(res).success(
            { watchHistory: currentUser.watchHistory },
            "Movie added to watch history successfully",
            201
          );   
    }
    // Add to watch history
    currentUser.watchHistory.push(video._id); 
    currentUser.watchHistory.slice(-10); 
    await currentUser.save({ validateModifiedOnly: true });  
    return new ApiResponse(res).success(
            { watchHistory: currentUser.watchHistory },
            "Movie added to watch history successfully",
            201
          );   
});

const getHistory= asyncHandler(async(req,res)=>{
   const user = req.user;
    const currentUser = await User.findById(user._id)
        .select("-password -refreshToken")
        .populate("watchHistory");  

    if (!currentUser) {
      throw new ApiError("User not found", 404);
    }       

    return new ApiResponse(res).success(
      { watchHistory: currentUser.watchHistory },
      "Fetched watch history successfully"
    );
})

export { createHistory, getHistory };