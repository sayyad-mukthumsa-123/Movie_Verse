import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import { FaHome } from 'react-icons/fa';
import bgImage from "../assets/home.jpg";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/profile/${id}`);
        setUser(response.data);
      } catch (err) {
        setError("User not found");
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!user) return <div className="text-center text-gray-500 mt-8">Loading...</div>;
  const avatarSvg = user.avatarUrl ? user.avatarUrl : null;

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center px-4 sm:px-6 md:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
      <div className="absolute top-3 left-2 cursor-pointer outline p-2 bg-slate-900 text-slate-50 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-all">
        <FaHome size={32} onClick={() => navigate('/home')} />
      </div>
      <div className="relative z-10 w-full max-w-lg bg-white bg-opacity-90 rounded-lg shadow-md p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-700 text-center mb-3">Profile</h1>
        <div className="flex flex-col items-center mb-4">
          {avatarSvg ? (
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 rounded-full outline outline-4 outline-black"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-gray-300 outline outline-4 outline-gray-400 mb-4 flex items-center justify-center">
              <span>No Avatar</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-700 mb-2 sm:mb-3 text-center">
            {user.username}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-cyan-700 text-center">{user.email}</p>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate(`/update-profile/${id}`)}
            className="w-full text-green-700 text-lg sm:text-xl md:text-2xl font-medium outline py-2 px-4 rounded-lg hover:bg-green-700 hover:text-white transition-all"
          >
            Update Profile
          </button>
          <button
            onClick={() => navigate(`/reset-password/${id}`)}
            className="w-full text-cyan-700 text-lg sm:text-xl md:text-2xl font-medium outline py-2 px-4 rounded-lg hover:bg-cyan-700 hover:text-white transition-all"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
