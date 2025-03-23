import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError} from "../utils/ApiError.js";
import { ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user detailse from frontend
  // validation - not empty
  // check if user already exists: email, username
  // check for images, check for avatar
  // upload them to cloudinary , avatar
  // create user object - check entry in db
  // remove password and refresh token from response
  // check for user creation
  // return response

  const { username, fullname, email, password } = req.body;
  console.log("email", email);

  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(404, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username is already exists");
  }

  const avatarLocalPath  = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  
  if(!avatarLocalPath){
    throw new ApiError(404, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiError(404, "Avatar is required");
  }

  const user = await User.create({
    username : username.toLowercase(),
    fullname,
    email,
    password,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
  })

  const createdUser = user.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
    throw new ApiError(500, "User is not created");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );


});

export { registerUser };
