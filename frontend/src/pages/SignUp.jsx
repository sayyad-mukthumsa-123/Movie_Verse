import React, { useEffect, useState } from "react";
import axios from "../axios/axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AvatarSelection from "../components/AvatarSelection";
import bgImage from "../assets/home.jpg";


const SignUp = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loadingResendOtp, setLoadingResendOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
  }, [navigate]);

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,4}$/;
    return regex.test(email);
  };

  const sendOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoadingOtp(true);
    setLoadingResendOtp(true);

    try {
      setLoadingOtp(true);
      setLoadingResendOtp(true);

      const { data } = await axios.post("/otp/send",
        { email });
      toast.success("OTP sent to your email!");
      setOtpSent(true);
      setStep(2);
      setResendDisabled(true);
      setResendTimer(30);

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoadingOtp(false);
      setLoadingResendOtp(false);
    }

  };

  const verifyOtp = async () => {

    try {
      const response = await axios.post(`otp/verify`,
        {
          email,
          otp,
        });

      toast.success("OTP verified successfully!");
      setIsOtpVerified(true);
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAvatar) {
      toast.error("Please select an avatar.");
      return;
    }

    if (!username || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`auth/register`,
        {
          username,
          email,
          password,
          confirmPassword,
          avatar: selectedAvatar,
        });

      toast.success("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-4 sm:p-6 md:p-8 xl:p-0"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>

      <div className="relative z-10 w-full max-w-lg bg-white bg-opacity-90 rounded-lg shadow-md p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-700 text-center mb-2">Sign Up</h1>

        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-xl sm:text-2xl font-medium text-cyan-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full text-xl sm:text-2xl px-4 py-2 border rounded-lg focus:outline"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={sendOtp}
              className="hover:bg-cyan-700 border outline transition-all font-medium hover:text-white text-cyan-700 text-lg sm:text-xl py-2 px-4 rounded-lg w-full"
              disabled={loadingOtp}
            >
              {loadingOtp ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="mt-4 text-center">
              <div className="text-lg sm:text-xl mb-4 text-cyan-700">
                Already have an account?
                <Link
                  to="/login"
                  className="inline-block mx-2 text-cyan-700 hover:underline hover:scale-105 transition-transform text-xl sm:text-2xl"
                >
                  SignIn
                </Link>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-2">
              <label className="block text-xl sm:text-2xl font-medium text-cyan-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                className="w-full text-xl sm:text-2xl px-4 py-2 border rounded-lg focus:outline"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={verifyOtp}
              className="hover:bg-cyan-700 text-cyan-700 outline border font-medium hover:text-white text-lg sm:text-xl py-2 px-4 rounded-lg w-full mt-5"
            >
              Verify OTP
            </button>

            <div className="mt-2 text-center">
              <button
                onClick={sendOtp}
                className={`text-lg sm:text-xl font-medium ${resendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-cyan-700 text-cyan-700 outline border hover:text-white py-2 px-4 rounded-lg w-full mt-1"
                  }`}
                disabled={resendDisabled || loadingResendOtp}
              >
                {loadingResendOtp
                  ? "Resending OTP..."
                  : resendDisabled
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-2">
              <label className="block text-xl sm:text-2xl font-medium text-cyan-800 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full text-xl sm:text-2xl px-4 py-2 border rounded-lg focus:outline"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-2 relative">
              <label className="block text-xl sm:text-2xl mb-1 font-medium text-cyan-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="w-full text-xl sm:text-2xl px-4 py-2 border rounded-lg focus:outline pr-12"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl sm:text-2xl text-cyan-700"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mb-1 relative">
              <label className="block text-xl sm:text-2xl mb-1 font-medium text-cyan-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  className="w-full text-xl sm:text-2xl px-4 py-2 border rounded-lg focus:outline pr-12"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl sm:text-2xl text-cyan-700"
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <AvatarSelection onSelectAvatar={setSelectedAvatar} />

            <button
              onClick={handleSubmit}
              className="hover:bg-cyan-700 text-cyan-700 outline border font-medium hover:text-white text-lg sm:text-xl py-2 px-4 rounded-lg w-full"
            >
              Register
            </button>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );

};

export default SignUp;



