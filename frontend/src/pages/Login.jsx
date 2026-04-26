import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = {
      username: formData.get("username"),
      password: formData.get("password"),
    };
    if (!loginData.username || !loginData.password) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all fields",
      });
      return;
    }
    api
      .post("/api/auth/login", loginData)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have been logged in successfully.",
        });
        navigate("/");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "An error occurred while logging in. Please try again.",
        });
      });
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold leading-[1.2] pb-4">Login Form</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 w-[30%] flex flex-col gap-6 rounded-lg bg-(--bg-transparent-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)]"
      >
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter Username"
          required
          className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          required
          className="py-3 px-2 rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] focus:outline-2 focus:outline-(--secondary-color)"
        />
        <button
          type="submit"
          className="py-3 px-2 text-xl font-semibold rounded-md bg-(--bg-transparent-2-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)] active:scale-[95%] cursor-pointer"
        >
          Login
        </button>
      </form>
      <p className="text-xl">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-400 text-md hover:underline focus:text-blue-500"
        >
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
