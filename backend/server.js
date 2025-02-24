const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error:", err));

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const profileRoutes = require("./routes/profileRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const reviewRoutes=require("./routes/reviewsRoutes");
const resetPasswordRoutes=require("./routes/resetPasswordRoutes");
const avatarRoutes=require("./routes/avatarRoutes")

app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);
app.use("/profile", profileRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/reviews", reviewRoutes);
app.use("/", resetPasswordRoutes);
app.use("/", avatarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
