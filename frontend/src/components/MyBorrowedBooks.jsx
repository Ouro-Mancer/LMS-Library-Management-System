import React, { useState, useEffect } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popUp);

  const [readBook, setReadBook] = useState(null);
  const [filter, setFilter] = useState("returned");

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  const openReadPopup = (id) => {
    const book = books?.find((book) => book._id === id);
    if (!book) {
      console.warn("Book not found for ID:", id);
      return;
    }
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };



  const formatDateAndTime = (timeStamp) => {

    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    const result = `${formattedDate} ${formattedTime}`;

    return result;

  };
  const returnedBooks = userBorrowedBooks?.filter((book) => book.returned === true);
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => book.returned === false);

  const booksToDisplay = filter === "returned" ? returnedBooks : nonReturnedBooks;


  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Borrowed Books
          </h2>
        </header>

        <header className="flex flex-col gap-3 sm:flex-row md:items-center mt-4">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${filter === "returned"
              ? "bg-[#18181B] text-white border-[#18181B]"
              : "bg-gray-200 text-[#18181B] border-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => {
              setFilter("returned");
              console.log("User Borrowed Books: ", userBorrowedBooks);
              console.log("Returned Books: ", returnedBooks);
            }}
          >
            Returned Books
          </button>
          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${filter === "non-returned"
              ? "bg-[#18181B] text-white border-[#18181B]"
              : "bg-gray-200 text-[#18181B] border-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => {
              setFilter("non-returned");
              console.log("User Borrowed Books: ", userBorrowedBooks);
              console.log("Non-Returned Books: ", nonReturnedBooks);
              console.log("Books to Display: ", booksToDisplay);
            }}
          >
            Non-Returned Books
          </button>
        </header>

        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Book Name</th>
                  <th className="px-4 py-2 text-left">Date & Time</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Returned</th>
                  <th className="px-4 py-2 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr key={index} className={(index + 1) % 2 === 0 ? "bg-gray-200" : ""}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.bookName}</td>
                    <td className="px-4 py-2">{formatDateAndTime(book.borrowedDate)}</td>
                    <td className="px-4 py-2">{formatDateAndTime(book.dueDate)}</td>
                    <td className="px-4 py-2">{book.returned ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">
                      <BookA className="cursor-pointer" onClick={() => openReadPopup(book.bookId)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            {filter === "returned" ? "No returned books found!" : "No non-returned books found!"}
          </h3>
        )}
      </main>
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
