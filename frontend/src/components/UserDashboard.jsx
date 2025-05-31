import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";

import bookIcon from "../assets/book-square.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import logo from "../assets/black-logo.png";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    const borrowed = userBorrowedBooks.filter(book => !book.returned);
    const returned = userBorrowedBooks.filter(book => book.returned);
    setTotalBorrowedBooks(borrowed.length);
    setTotalReturnedBooks(returned.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed", "Total Returned"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#152615"], // Indigo + Emerald
        hoverOffset: 4,
      },
    ],
  };

  return (
    <main className="min-h-[screen] relative flex-1 p-6 pt-28">
      <Header />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="col-span-2 flex flex-col gap-8">

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              icon={bookIcon}
              text="Your Borrowed Book List"
              bgColor="bg-white"
            />
            <DashboardCard
              icon={returnIcon}
              text="Your Returned Book List"
              bgColor="bg-white"
            />
          </div>

          {/* Browse & Logo Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <DashboardCard
              icon={browseIcon}
              text="Let's Browse Books Inventory"
              bgColor="bg-white"
              fullWidth
            />
            /
          </div>

          {/* Quote Section */}
          <div className="bg-white p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative flex-[3] flex justify-center items-center rounded-2xl">
            <h4 className="text-xl sm:text-2xl font-semibold text-center italic">“Reading is to the mind what exercise is to the body.”</h4>
            <p className="text-sm text-gray-500 mt-4 self-end">~ NIELIT Team</p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-between gap-10">

          {/* Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <Pie data={data} />
          </div>

          {/* Chart Legend */}
          <div className="bg-white p-6 rounded-xl flex items-center gap-6 shadow-md">
            <img src={logo} alt="logo" className="h-16" />
            <div className="border-l h-full border-gray-300"></div>
            <div className="flex flex-col gap-3 text-sm">
              <LegendItem color="#1E3A8A" label="Total Borrowed Books" />
              <LegendItem color="#10B981" label="Total Returned Books" />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

const DashboardCard = ({ icon, text, bgColor = "bg-white", fullWidth = false }) => (
  <div
    className={`flex items-center gap-4 ${bgColor} rounded-xl shadow-sm p-5 transition hover:shadow-lg ${fullWidth ? "w-full" : ""
      }`}
  >
    <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-center">
      <img src={icon} alt="icon" className="w-8 h-8" />
    </div>
    <p className="text-lg font-medium">{text}</p>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3">
    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
    <span>{label}</span>
  </div>
);

export default UserDashboard;
