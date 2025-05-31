import { catchAsyncErrors } from "../Middlewares/catchAsyncErrors.js";
import { Book } from "../Model/bookModel.js"
import ErrorHandler from "../Middlewares/errorMiddlewares.js";


export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { subject, bookName, author, description, publication, bookType, charges, quantity, language, serialNo } = req.body;

    if (!subject || !bookName || !author || !description || !publication || !bookType || quantity === undefined||  !serialNo || !language) {
        return next(new ErrorHandler("Please fill all the fields.", 400));
    }

    const book = await Book.create({
        subject,
        bookName,
        author,
        description,
        publication,
        bookType,
        // charges,
        quantity,
        language,
        serialNo
    });
    res.status(201).json({
        success: true,
        message: "Book added successfully",
        book,
    });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
    }
    res.status(200).json({
    success: true,
    message: "Book deleted successfully."
    });
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const { language } = req.query;
    let filter = {};
    if (language) {
        filter.language = language;
    }
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        books,
    });
});