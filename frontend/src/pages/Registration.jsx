import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Registration = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    if (!userData.username || !userData.email || !userData.password) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all fields",
      });
      return;
    }
    axios
      .post(`${VITE_API_URL}/api/auth/register`, userData, {
        withCredentials: true,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "You have been registered successfully.",
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "An error occurred while registering. Please try again.",
        });
      });
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold leading-[1.2] pb-4">
        Registration Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 w-[30em] flex flex-col gap-6 rounded-lg bg-(--bg-transparent-color) backdrop-blur-[14px] backdrop-saturate-150 border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2)]"
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
          type="email"
          id="email"
          name="email"
          placeholder="Enter Email"
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
          Register
        </button>
      </form>
      <p className="text-xl">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-400 text-md hover:underline focus:text-blue-500"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Registration;
