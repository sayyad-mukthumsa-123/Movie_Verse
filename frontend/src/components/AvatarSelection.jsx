import React, { useEffect, useState } from "react";
import axios from "../axios/axios"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvatarSelection = ({ onSelectAvatar }) => {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatarLocal] = useState(null);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get("/avatars");
        setAvatars(response.data);
      } catch (error) {
        toast.error("Failed to load avatars.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAvatars();
  }, []);

  const handleAvatarSelect = (avatarId, svg) => {
    setSelectedAvatarLocal(avatarId);
    onSelectAvatar(svg);
  };

  return (
    <div className="p-2 md:p-4 lg:p-6 mb-2">
      {isLoading ? (
        <div className="text-center text-lg">Loading avatars...</div>
      ) : (
        <div>
          <div className="text-2xl text-cyan-700 font-semibold mb-3 text-center">Pick an Avatar</div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-4 gap-2">
            {avatars.map(({ id, svg }, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden w-fit 
                  ${selectedAvatar === id ? "border-4 border-cyan-800" : "border-2 border-gray-300"}`}
                onClick={() => handleAvatarSelect(id, svg)}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: svg }}
                  className="w-12 h-12 sm:w-20 sm:h-20 p-1 object-cover transition-transform transform hover:scale-105"
                />
                {selectedAvatar === id && (
                  <div className="absolute inset-0 text-xl bg-slate-800 bg-opacity-60 flex justify-center items-center text-white font-bold">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelection;
