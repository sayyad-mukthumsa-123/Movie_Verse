import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios/axios";
import bgImage from "../assets/home.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AvatarSelection from "../components/AvatarSelection";

const UpdateProfile = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`profile/${id}`);
        setUser(response.data);
        setUsername(response.data.username || "");
        setSelectedAvatar(response.data.avatarUrl || "");
      } catch (err) {
        toast.error("Failed to load user data.");
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleSave = async () => {
    const updatedData = {};

    if (username.trim() && username !== user?.username) {
      updatedData.username = username;
    }
    if (selectedAvatar.trim() && selectedAvatar !== user?.avatarUrl) {
      updatedData.avatarUrl = selectedAvatar;
    }

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes detected.", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.put(`profile/${id}`,
        updatedData);
      toast.success(response.data.message, { position: "top-right", autoClose: 3000 });
      setTimeout(() => {
        navigate(`../profile/${id}`);
      }, 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred while updating the profile.";
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center px-4 sm:px-6 md:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
      <div className="relative z-10 w-full max-w-lg sm:max-w-md bg-white bg-opacity-90 rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-700 text-center mb-4">Update Profile</h1>
        <form>
          <div className="mb-4">
            <label className="block text-xl sm:text-2xl font-medium mb-1 text-cyan-800">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={user?.username || "Enter your username"}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline text-lg sm:text-2xl"
            />
          </div>
          <div className="mb-6">
            <AvatarSelection onSelectAvatar={setSelectedAvatar} />
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(`../profile/${id}`)}
              className="w-full sm:w-5/12 text-red-700 text-xl border sm:text-2xl outline hover:bg-red-700 hover:text-white transition-all font-medium py-2 px-4 rounded-md focus:outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-5/12 text-green-700 text-xl sm:text-2xl outline border hover:bg-green-700 hover:text-white transition-all font-medium py-2 px-4 rounded-md focus:outline"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default UpdateProfile;
