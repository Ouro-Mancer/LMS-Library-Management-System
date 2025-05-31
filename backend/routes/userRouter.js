import express from "express";
import {getAllUsers, registerNewAdmin, deleteUser, updateProfile} from "../Controllers/userController.js"
import {isAuthenticated, isAuthorized} from "../Middlewares/authMiddleware.js"


const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin", "main-Admin"), getAllUsers);
router.post("/add/new-Admin", isAuthenticated, isAuthorized("main-Admin"), registerNewAdmin);
router.delete("/:id", isAuthenticated, isAuthorized("Admin", "main-Admin"), deleteUser);
router.put('/update-profile', isAuthenticated, updateProfile);

export default router;