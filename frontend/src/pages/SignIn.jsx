import React, { useEffect, useState } from "react";
import axios from "../axios/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import bgImage from "../assets/home.jpg";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const token = localStorage.getItem("token");
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please provide a valid email.");
      return;
    }

    try {
      const response = await axios.post("/auth/login",
        {
          Email: email,
          Password: password,
        });

      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      toast.success("Sign in successful!");

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.msg || "Invalid email or password.");
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
      console.error("Error:", error);
    }

  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email to reset the password.");
      return;
    }

    try {
      const response = await axios.post("/auth/get-user-id",
        {
          email,
        });

      navigate(`/reset-password/${response.data.userId}`);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.msg || "User not found. Please enter a valid email.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center px-4 md:px-8 lg:px-0"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
      <div className="relative z-10 w-full max-w-md md:max-w-lg bg-white bg-opacity-90 rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-700 text-center mb-4">Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg md:text-2xl mb-1 text-cyan-700 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg border focus:outline text-lg md:text-2xl"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2 relative">
            <label htmlFor="password" className="block mb-1 text-cyan-700 font-medium text-lg md:text-2xl">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 text-slate-700 border rounded-lg focus:outline text-lg md:text-2xl pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-lg md:text-2xl text-cyan-700"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="text-right m-2">
            <button
              type="button"
              className="text-cyan-700 text-lg md:text-xl hover:underline focus:outline-none hover:scale-105 transition-all"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
          <div className="text-lg md:text-xl mb-4 text-cyan-700 ">
            Don't have an account? {" "}
            <Link to="/register" className="inline-block text-cyan-700 hover:underline hover:scale-105 transition-all">
              SignUp
            </Link>
          </div>
          <button
            type="submit"
            className="w-full text-lg md:text-2xl outline border border-cyan-700 font-medium text-cyan-500 py-2 px-4 rounded-lg hover:bg-cyan-700 hover:text-white transition-all focus:outline"
          >
            Sign In
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
