import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import Hading from "../assets/Hading.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import profile from "../assets/update-profile.svg";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup, toggleSettingPopup, toggleUpdateProfilePopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import UpdateProfilePopup from "../popups/UpdateProfilePopup";


const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponents }) => {

  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup, updateProfilePopup } = useSelector((state) => state.popUp);
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (

    <>
      <aside
        className={`${isSideBarOpen ? "left-0" : "-left-full"
          } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-zinc-900 text-white flex-col h-full`}
        style={{ position: "fixed" }}>

        <div className="px-6 py-8 my-8">
          <img src={logo_with_title} alt="logo" className="h-38 w-68 -mt-8" />
        </div>

        <nav className="flex-1 px-6 space-y-0">

          <button onClick={() => setSelectedComponents("Dashboard")} className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 ">
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>

          <button onClick={() => setSelectedComponents("Books")} className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 ">
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>

          {
            isAuthenticated && (user?.role === "Admin" || user?.role === "main-Admin") && (
              <>
                <button onClick={() => setSelectedComponents("Catalog")} className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 ">
                  <img src={catalogIcon} alt="icon" />
                  <span>Catalog</span>
                </button>

                <button onClick={() => setSelectedComponents("Users")} className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 ">
                  <img src={usersIcon} alt="icon" />
                  <span>Users</span>
                </button>

                <button onClick={() => dispatch(toggleAddNewAdminPopup())} className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 ">

                  <RiAdminFill className="w-6 h-6" />

                  <span>Add New Admin</span>
                </button>

              </>

            )
          }

          {
            isAuthenticated && (user?.role === "User") && (
              <>
                <button onClick={() => setSelectedComponents("My Borrowed Books")} className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 ">
                  <img src={catalogIcon} alt="icon" />
                  <span>My Borrowed Books</span>
                </button>


              </>
            )
          }

          <button onClick={() => dispatch(toggleSettingPopup())} className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 ">
            <img src={settingIcon} alt="icon" />
            <span>Update Credentials</span>
          </button>

          <button onClick={() => dispatch(toggleUpdateProfilePopup())} className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 ">
            <img src={profile} alt="icon" />
            <span>Update Profile</span>
          </button>



        </nav>

        <div className="px-6 py-4">
          <button onClick={handleLogout} className="py-2 font-medium text-center bg-transparent rounded-md  cursor-pointer flex items-center justify-center space-x-5 mx-auto w-fit">
            <img src={logoutIcon} alt="icon" />
            <span>Log Out</span>
          </button>

        </div>

        <img src={closeIcon} alt="icon" onClick={() => setIsSideBarOpen(!setIsSideBarOpen)} className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden cursor-pointer " />




      </aside>
      {addNewAdminPopup && <AddNewAdmin />}

      {settingPopup && <SettingPopup />}

      {updateProfilePopup && <UpdateProfilePopup />}
    </>


  )
};

export default SideBar;
