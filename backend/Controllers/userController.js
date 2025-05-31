import { catchAsyncErrors } from "../Middlewares/catchAsyncErrors.js";
import ErrorHandler from "../Middlewares/errorMiddlewares.js";
import { User } from "../Model/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

// Get all users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

// Register New Admin (Only Main-Admin Can Register)
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  // Only main-Admin can register new admins
  if (req.user.role !== "main-Admin") {
    return next(new ErrorHandler("Only main-Admin can register new Admins.", 403));
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Admin avatar is required.", 400));
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return next(new ErrorHandler("All fields including role are required.", 400));
  }

  const validRoles = ["Admin", "main-Admin"];
  if (!validRoles.includes(role)) {
    return next(new ErrorHandler("Invalid role provided.", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });

  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(new ErrorHandler("Password must be between 8 to 16 characters", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Invalid image format", 400));
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
    folder: "LMS_ADMIN_AVATAR",
    width: 150,
    crop: "scale",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log("Cloudinary error: ", cloudinaryResponse.error || "Unknown error...");
    return next(new ErrorHandler("Failed to upload image", 500));
  }

  const user = await User.create({
    name,
    email,
    password: hashPassword,
    role, // <-- Now it's dynamic
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: `${role} registered successfully`,
    user,
  });
});

// Delete a user by ID (Admin only)
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await user.deleteOne(); // or user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

//profile Update feature

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const { name, email } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;

  // Only Admins can update profile picture
  if (req.files && req.files.avatar) {
    if (user.role === 'Admin' || user.role === 'main-Admin') {
      // Delete previous avatar if exists
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const file = req.files.avatar;
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'avatars',
        width: 150,
        crop: "scale",
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } else {
      return next(new ErrorHandler('Only admins can update profile picture', 403));
    }
  }

  await user.save();

  res.status(200).json({ message: 'Profile updated successfully', user });
});
