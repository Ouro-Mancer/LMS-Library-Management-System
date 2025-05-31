import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import Catalog from "../components/Catalog";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import Users from "../components/Users";
import BookManagement from "../components/BookManagement";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const isAdmin = user?.role === "Admin" || user?.role === "main-Admin";

  const renderComponent = () => {
    switch (selectedComponents) {
      case "Dashboard":
        return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;

      case "Books":
        return <BookManagement />;

      case "Catalog":
        return isAdmin ? <Catalog /> : null;

      case "Users":
        return isAdmin ? <Users /> : null;

      case "My Borrowed Books":
        return !isAdmin ? <MyBorrowedBooks /> : null;

      default:
        return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;
    }
  };

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-zinc-900 rounded-md h-9 w-9 text-white">
        <GiHamburgerMenu
          className="text-2xl cursor-pointer"
          onClick={() => setIsSideBarOpen((prevState) => !prevState)}
        />
      </div>

      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponents={setSelectedComponents}
      />

      {renderComponent()}
    </div>
  );
};

export default Home;
