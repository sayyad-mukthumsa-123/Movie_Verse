const UserModel = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, avatar } = req.body;

        if (!username || !email || !password || !confirmPassword || !avatar) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        if (password.length < 8) {
            return res.status(400).json({ msg: "Password must be at least 8 characters long." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match." });
        }

        const userExist = await UserModel.findOne({ Email: email });
        if (userExist) {
            return res.status(400).json({ msg: "Email already exists." });
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = new UserModel({
            Username: username,
            Email: email,
            Password: hashedPassword,
            Avatar: avatar,
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            token,
            msg: "User registered successfully.",
            avatarUrl: avatar,
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};

const login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({ msg: "Please provide both email and password." });
        }

        const user = await UserModel.findOne({ Email });
        if (!user) {
            console.log("User not found with email:", Email);
            return res.status(400).json({ msg: "Invalid email" });
        }

        console.log("Stored Hashed Password:", user.Password);
        console.log("Entered Password:", Password);

        const isMatch = await user.comparePassword(Password);
        console.log("Password verification result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password." });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        return res.status(200).json({
            token,
            userId: user._id,
            msg: "User login successful."
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ msg: "Internal server error. Please try again later." });
    }
};

const getUserId = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: "Email is required" });
    }

    try {
        const user = await UserModel.findOne({ Email: email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ userId: user._id });
    } catch (error) {
        console.error("Error fetching user ID:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

module.exports = { register, login, getUserId };
