import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setShowModal(true)}
        className="text-red-500 text-lg sm:text-xl md:text-2xl font-semibold bg-slate-50 hover:bg-red-500 hover:text-slate-50 py-2 px-4 rounded-md transition-transform duration-300"
      >
        Logout
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-slate-900 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-md sm:max-w-lg md:max-w-xl">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold">Are you sure you want to logout?</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-slate-50 text-lg sm:text-xl md:text-2xl text-red-500 px-4 py-2 rounded-md outline hover:bg-red-500 hover:text-slate-50 w-full sm:w-auto"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-50 text-lg sm:text-xl md:text-2xl text-slate-900 px-4 py-2 rounded-md outline hover:bg-slate-900 hover:text-slate-50 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
