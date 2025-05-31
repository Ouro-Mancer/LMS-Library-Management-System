import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../Model/userModel.js";


export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("User is not authenticated", 401)); // Changed status code to 401
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler("User not found. Authentication failed.", 401));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token. Please log in again.", 401));
    }

    
});

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ErrorHandler("User authentication required.", 401));
        }

        // Allow access if user role is in the given roles OR if user is "Main-Admin"
        if (!roles.includes(req.user.role) && req.user.role !== "main-Admin") {
            return next(new ErrorHandler(`Access denied. Role '${req.user.role}' not authorized.`, 403));
        }

        next();
    };
};



