import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../model/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError("Internal Server Error", 500);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get data from frontend
  // validate data
  // check if user already exists : email, userName
  // if exists, return error
  // if not exists, create user
  // create user in database
  // create access token and refresh token
  // send response with tokens

  const { email, password, fullName, userName } = req.body;

  if (
    [email, password, fullName, userName].some((field) => field?.trim() == "")
  ) {
    throw new ApiError("All field are required", 400);
  }

  const userData = await User.findOne({ $or: [{ email }, { userName }] });

  if (userData) {
    throw new ApiError("User is already existing", 400);
    // return res.status(400).json({
    //         status: 'error',
    //         message:"User is already existing",
    //         data:null
    //     });
  }

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email: email.toLowerCase(),
    password,
  });

  const currentUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!currentUser) {
    throw new ApiError(res).toResponse("User not found", 404);
  }

  // throw new ApiResponse(res).success({
  //   user: currentUser,
  // });
  return new ApiResponse(res).success(
  { user: currentUser },
  "User created successfully",
  201
); 
});

const loginUser = asyncHandler(async (req, res) => {
  // get data from frontend
  // validate email(username) and password
  // check if user exists
  // if not return
  // if yes means authenticate user
  // return the yser data

  const { email, password } = req.body;

  if ([email, password].some((field) => field == "")) {
    throw new ApiError("All fields are required", 400);
  }

  const userData = await User.findOne({ email: email.toLowerCase() }).select(
    "-refreshToken"
  );
  if (!userData) {
    throw new ApiError("User not found", 404);
  }

  const isPasswordCorrect = await userData.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError("Invalid password", 401);
  }

  const { accessToken, refreshToken } = await generateToken(userData._id);

  // throw new ApiResponse(res).success({
  //   statusCode: 200,
  //   message: "Login successful",
  //   user: userData,
  //   accessToken: accessToken,
  //   refreshToken: refreshToken,
  // });

  return new ApiResponse(res).success(
  {
    user: userData,
    accessToken,
    refreshToken
  },
  "Login successful",
  200
);
});

const currentUserData = asyncHandler(async (req, res) => {
  // get user from request
  // return user data

  const user = req.user;

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const currentUser = await User.findById(user._id).select("-password -refreshToken");

  if (!currentUser) {
    throw new ApiError("User not found", 404);
  }

  return new ApiResponse(res).success(
    { user: currentUser },
    "User data retrieved successfully",
    200
  );
});

export { registerUser, loginUser, currentUserData };
