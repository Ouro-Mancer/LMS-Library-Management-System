import React, { useState } from "react";
import closeIcon from "../assets/close-square.png";
import profile from "../assets/update-profile.svg";

import { useDispatch, useSelector } from "react-redux";
import { updateProfilePopup } from "../store/slices/userSlice"; // Profile update ka real action
import { toggleUpdateProfilePopup } from "../store/slices/popUpSlice"; // Popup open/close ka action

const UpdateProfilePopup = ({ role }) => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth); // <-- Corrected here

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    dispatch(updateProfilePopup(formData));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg sm:w-auto lg:w-1/2 2xl:w-1/3">
        <div className="p-6">
          <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black">
            <div className="flex items-center gap-3">
              <img
                src={profile}
                alt="profile-icon"
                className="bg-gray-300 p-5 rounded-lg"
              />
              <h3 className="text-xl font-bold">Update Profile</h3>
            </div>
            <img
              className="cursor-pointer"
              src={closeIcon}
              alt="close-icon"
              onClick={() => dispatch(toggleUpdateProfilePopup())}
            />
          </header>

          <form onSubmit={handleUpdateProfile}>

            {/* Avatar Upload - Sirf Admin and Main-Admin ke liye */}
            {isAuthenticated && (user?.role === "Admin" || user?.role === "main-Admin") && (
              <div className="flex flex-col items-center space-y-4 mb-8">
                {preview && (
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <label className="cursor-pointer flex items-center space-x-2 bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-gray-700">Choose File</span>
                  {avatar && <span className="text-xs text-gray-500">{avatar.name}</span>}
                </label>
              </div>
            )}

            {/* Name Field */}
            <div className="mb-4 sm:flex gap-4 items-center">
              <label className="block text-gray-900 font-medium w-full">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-10">
              <button
                type="button"
                onClick={() => dispatch(toggleUpdateProfilePopup())}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                {loading ? "Updating..." : "CONFIRM"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePopup;
