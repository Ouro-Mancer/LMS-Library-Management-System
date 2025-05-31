import React, { useEffect, useState } from "react";
import { BookA, NotebookPen, DeleteIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import {
  fetchAllBooks,
  resetBookSlice,
  deleteBook, // <-- Import deleteBook
} from "../store/slices/bookSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popUp
  );

  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (id) => {
    setBorrowBookId(id);
    dispatch(toggleRecordBookPopup());
  };

  // --- New: Handle Delete Book ---
  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(id));
    }
  };

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [
    dispatch,
    message,
    error,
    loading,
    borrowSliceError,
    borrowSliceLoading,
    borrowSliceMessage,
  ]);

  const searchedBooks = books?.filter((book) =>
    book?.bookName?.toLowerCase().includes(searchKeyword)
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user && (user?.role === "Admin" || user?.role === "main-Admin")
              ? "Book Management"
              : "Books"}
          </h2>

          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {isAuthenticated && user?.role === "main-Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
              >
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                  +
                </span>
                ADD BOOK
              </button>
            )}
            <input
              type="text"
              placeholder="Search books..."
              className="w-full sm:w-52 border-gray-300 rounded-md"
              value={searchKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>

        {/* Table */}
        {books && books.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Book Name</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-left">Serial Number</th>

                  {
                    isAuthenticated && user.role === "User" &&(
                      <th className="px-4 py-2 text-center">Book Info.</th>
                    )}

                  {isAuthenticated &&
                    (user?.role === "Admin" || user?.role === "main-Admin") && (
                      <>
                        <th className="px-6 py-2 text-left">Quantity</th>
                        {/* <th className="px-4 py-2 text-left">Charges</th> */}
                        <th className="px-4 py-2 text-left">Availability</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </>
                    )}
                </tr>
              </thead>
              <tbody>
                {searchedBooks.map((book, index) => (
                  <tr
                    key={book._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.subject}</td>
                    <td className="px-4 py-2">{book.bookName}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2">{book.serialNo}</td>

                    {isAuthenticated && user.role === "User" && (
                      <td className="px-4 py-2 flex space-x-2 justify-center">
                        <BookA
                          className="cursor-pointer text-blue-600 hover:text-blue-800"
                          onClick={() => openReadPopup(book._id)}
                        />
                      </td>
                    )}

                    {isAuthenticated &&
                      (user?.role === "Admin" ||
                        user?.role === "main-Admin") && (
                        <>
                          <td className="px-14 py-4">{book.quantity}</td>
                          {/* <td className="px-8 py-2">₹{book.charges}</td> */}
                          <td className="px-8 py-2">
                            {book.quantity > 0 ? "Available" : "Unavailable"}
                          </td>
                          <td className="px-4 py-2 flex space-x-2 justify-center">
                            <BookA
                              className="cursor-pointer text-blue-600 hover:text-blue-800"
                              onClick={() => openReadPopup(book._id)}
                            />
                            <NotebookPen
                              className="cursor-pointer text-green-600 hover:text-green-800"
                              onClick={() => openRecordBookPopup(book._id)}
                            />
                            <DeleteIcon
                              className="cursor-pointer text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteBook(book._id)}
                            />
                          </td>
                        </>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No books found in Library!
          </h3>
        )}
      </main>

      {/* Popups */}
      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;
