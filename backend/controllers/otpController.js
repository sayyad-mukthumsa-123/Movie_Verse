const nodemailer = require("nodemailer");
const UserModel = require("../models/usermodel");

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Registration",
    text: `Your OTP for registration is ${otp}.`,
  };

  await transporter.sendMail(mailOptions);
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ Email: email });
    if (user) return res.status(400).json({ message: "Email already exists." });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, timestamp: Date.now() };

    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent." });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP." });
  }
};

const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email]?.otp === parseInt(otp)) {
    res.json({ message: "OTP verified." });
    delete otpStore[email];
  } else {
    res.status(400).json({ message: "Invalid OTP." });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (otpStore[email] && Date.now() - otpStore[email].timestamp < 60000) {
    return res.status(429).json({ message: "Wait before requesting OTP." });
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp: newOtp, timestamp: Date.now() };

  await sendOtpEmail(email, newOtp);
  res.json({ message: "New OTP sent." });
};

module.exports = { sendOtp, verifyOtp, resendOtp };
