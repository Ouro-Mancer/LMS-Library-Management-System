import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [publication, setPublication] = useState("");
  const [bookType, setBookType] = useState("Hardcopy");
  const [language, setLanguage] = useState("English");
  const [serialNo, setSerialNo] = useState("");
  const [charges, setCharges] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAddBook = (e) => {
    e.preventDefault();

    const data = {
      bookName,
      author,
      description,
      subject,
      publication,
      bookType,
      language,
      serialNo,
      // charges: Number(charges),
      quantity: Number(quantity),
    };

    dispatch(addBook(data));
    dispatch(toggleAddBookPopup());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="space-y-4">
          <input
            type="text"
            placeholder="Book Name"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Publication"
            value={publication}
            onChange={(e) => setPublication(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            value={bookType}
            onChange={(e) => setBookType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Textbook">Textbook</option>
            <option value="Course">Course</option>
            <option value="Motivational Novel">Motivational Novel</option>
            <option value="Creating Positive Habits">Creating Positive Habits</option>
            <option value="Others">Others</option>
          </select>
          
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Bilingual">Bilingual</option>
          </select>

          <input
            type="number"
            placeholder="Serial Number"
            value={serialNo}
            onChange={(e) => setSerialNo(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* <input
            type="number"
            placeholder="Charges"
            value={charges}
            onChange={(e) => setCharges(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          /> */}

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleAddBookPopup())}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;
