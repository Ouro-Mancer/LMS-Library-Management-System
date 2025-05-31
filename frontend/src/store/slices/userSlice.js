import { createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup, toggleUpdateProfilePopup } from "./popUpSlice";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
    },
    reducers: {
        fetchAllUsersRequest(state) {
            state.loading = true;
        },
        fetchAllUsersSuccess(state, action) {
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUsersFailed(state) {
            state.loading = false;
        },
        addNewAdminRequest(state) {
            state.loading = true
        },
        addNewAdminSuccess(state) {
            state.loading = false
        },
        addNewAdminFailed(state) {
            state.loading = false
        },
        deleteUserRequest(state) {
            state.loading = true;
        },
        deleteUserSuccess(state) {
            state.loading = false;
        },
        deleteUserFailed(state) {
            state.loading = false;
        },
        updateProfileRequest(state) {
            state.loading = true;
        },
        updateProfileSuccess(state) {
            state.loading = false;
        },
        updateProfileFailed(state) {
            state.loading = false;
        },


    },
});

export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    await axios
        .get("http://localhost:4000/api/v1/user/all", { withCredentials: true })
        .then((res) => {
            dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
        })
        .catch((err) => {
            dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message))
        });
};

export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest());

    await axios
        .post("http://localhost:4000/api/v1/user/add/new-Admin", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            dispatch(userSlice.actions.addNewAdminSuccess());
            toast.success(res.data.message);
            dispatch(toggleAddNewAdminPopup())
        })
        .catch((err) => {
            dispatch(userSlice.actions.addNewAdminFailed()); // ✅ Correct
            toast.error(err.response.data.message);
        })
};

export const updateProfilePopup = (data) => async (dispatch) => {
    dispatch(userSlice.actions.updateProfileRequest());

    await axios
        .put("http://localhost:4000/api/v1/user/update-profile", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            dispatch(userSlice.actions.updateProfileSuccess());
            toast.success(res.data.message || "Profile Updated Successfully..");
            dispatch(toggleUpdateProfilePopup())
        })
        .catch((err) => {
            dispatch(userSlice.actions.updateProfileFailed()); // ✅ Correct
            toast.error(err.response.data.message || "Failed to Update..");
        })
};

export const deleteUser = (userId) => async (dispatch) => {
    dispatch(userSlice.actions.deleteUserRequest());
    
    await axios
        .delete(`http://localhost:4000/api/v1/user/${userId}`, {
            withCredentials: true,
        })
        .then((res) => {
            dispatch(userSlice.actions.deleteUserSuccess());
            toast.success(res.data.message || "User deleted successfully");
            dispatch(fetchAllUsers());
        })
        .catch((err) => {
            dispatch(userSlice.actions.deleteUserFailed());
            toast.error(err.response.data.message || "Failed to delete user");
        });
};



export default userSlice.reducer;