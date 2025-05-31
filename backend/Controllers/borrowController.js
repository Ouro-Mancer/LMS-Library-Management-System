import { catchAsyncErrors } from "../Middlewares/catchAsyncErrors.js";

import ErrorHandler from "../Middlewares/errorMiddlewares.js";

import { Borrow } from "../Model/borrowModel.js";

import { Book } from "../Model/bookModel.js";

import { User } from "../Model/userModel.js";

import { calculatefine } from "../utils/fineCalculator.js";

export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { borrowedBooks } = req.user;
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // book ID
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  // Fetch the book
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // Fetch the user with email check (case insensitive)
  const user = await User.findOne({
    email: email.toLowerCase(),
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const activeBorrowedBooks = user.borrowedBooks.filter(
    (book) => !book.returned
  );

  // 2. Set limit according to role
  let limit = 2; // Default for normal User
  if (user.role === "Admin" || user.role === "main-Admin") {
    limit = 3;
  }

  // 3. Check if limit is reached
  if (activeBorrowedBooks.length >= limit) {
    return next(
      new ErrorHandler(
        `Borrow limit reached! You can only borrow up to ${limit} books.`,
        400
      )
    );
  }

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available.", 400));
  }

  // Check if user already borrowed this book and hasn't returned
  const alreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );

  if (alreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed by this user.", 400));
  }

  // Calculate due date (7 days from now)
  const borrowDate = new Date();
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Update book inventory
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Push borrowed book info into user model
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.bookName,
    borrowedDate: borrowDate,
    dueDate,
    returned: false,
  });
  await user.save();

  // Create Borrow record
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    charges: book.charges, // FIXED: added charges to avoid "undefined" error
    borrowDate,
    dueDate,
  });

  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully.",
  });
});

export const getBorrowedBooksForAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const borrowedBooks = await Borrow.find()
      .populate("book") // This populates the book details
      .populate("user.id"); // Optional: if you want full user info

    res.status(200).json({
      success: true,
      borrowedBooks,
    });
  }
);

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("USer not found.", 404));
  }

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );
  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  borrowedBook.returned = true;
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrow = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });
  if (!borrow) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }
  borrow.returnDate = new Date();

  const fine = calculatefine(borrow.dueDate);
  borrow.fine = fine;
  await borrow.save();

  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `The book has been returned successfully. Total fine = ₹${
            fine
          }.`
        : "The book has been returned successfully. No fine is applicable.",
  });
});

