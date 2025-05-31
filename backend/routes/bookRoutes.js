import {
  isAuthenticated,
  isAuthorized,
} from "../Middlewares/authMiddleware.js";

import {
  addBook,
  deleteBook,
  getAllBooks,
} from "../Controllers/bookController.js";

import express from "express";

const router = express.Router();

router.post("/add", isAuthenticated, isAuthorized("Admin", "main-Admin"), addBook);
router.get("/all", isAuthenticated, getAllBooks);

router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin", "main-Admin"), deleteBook);

export default router;
