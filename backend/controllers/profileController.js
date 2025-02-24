const UserModel = require("../models/usermodel");

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { username, avatarUrl } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { Username: username, Avatar: avatarUrl },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ username: user.Username, email: user.Email, avatarUrl: user.Avatar });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfile, getProfile };
