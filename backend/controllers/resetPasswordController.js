const argon2 = require("argon2");
const UserModel = require("../models/usermodel");

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Please provide both email and new password" });
  }

  try {
    const user = await UserModel.findOne({ Email: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordMatched = await argon2.verify(user.Password, newPassword);
    if (isPasswordMatched) return res.status(400).json({ message: "New password cannot be the same as the current password" });

    user.Password = await argon2.hash(newPassword);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = { resetPassword };
