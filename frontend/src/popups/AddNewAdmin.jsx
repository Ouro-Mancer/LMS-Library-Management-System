import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role || !avatar) {
      toast.error("Please fill in all fields and upload an avatar.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role); // ✅ Required by backend
    formData.append("avatar", avatar);

    dispatch(addNewAdmin(formData));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-[42.333333%]">
          <div className="p-6">
            <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black">
              <div className="flex items-center gap-3">
                <img
                  src={keyIcon}
                  alt="key-icon"
                  className="bg-gray-300 p-5 rounded-lg"
                />
                <h3 className="text-xl font-bold">Add New Admin</h3>
              </div>
              <img
                className="cursor-pointer"
                src={closeIcon}
                alt="close-icon"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              />
            </header>

            <form onSubmit={handleAddNewAdmin}>
              <div className="flex flex-col items-center mb-6">
                <label htmlFor="avatarInput" className="cursor-pointer">
                  <img
                    src={avatarPreview ? avatarPreview : placeHolder}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Admin's Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin's Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Role Dropdown */}

              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="main-Admin">main-Admin</option> {/* Added Main-Admin option */}
                </select>
              </div>


              <div className="mb-4">
                <label className="block text-gray-900 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin's Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => dispatch(toggleAddNewAdminPopup())}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewAdmin;
