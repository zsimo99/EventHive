"use client";
import TextControl from "@/components/TextControl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { set } from "mongoose";

function page() {
  const [userInfo, setUserInfo] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<any>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const registerUser = async () => {
    setError({ userName: "", email: "", password: "", confirmPassword: "" });
    try {
      if (!userInfo.userName || !userInfo.email || !userInfo.password) {
        setError({
          ...error,
          userName: !userInfo.userName ? "username is required" : "",
          email: !userInfo.email ? "email is required" : "",
          password: !userInfo.password ? "password is required" : "",
        });
        return;
      }
      const formdata = new FormData();
      if (userInfo.password !== userInfo.confirmPassword) {
        setError({ ...error, confirmPassword: "passwords do not match" });
        return;
      }
      formdata.append("userName", userInfo.userName);
      formdata.append("email", userInfo.email);
      formdata.append("password", userInfo.password);
      const res = await fetch("/api/user/register", {
        method: "POST",
        body: formdata,
      });
      if (res.ok) {
        //navigate to login page
        toast.success(
          "Registration successful! Please verify your email before logging in."
        );
        router.push("/auth/login");
      } else {
        const data = await res.json();
        toast.error(data.message || "Registration failed. Please try again.");
        if (data.errors) {
          // data.errors is an array, iterate through it
          data.errors.forEach((err: any) => {
            const key = Object.keys(err)[0];
            setError((prevError: any) => ({
              ...prevError,
              [key]: err[key],
            }));
          });
        }
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };
  return (
    <div className="h-screen pt-20 bg-linear-to-br from-gray-950 to-gray-800 flex justify-center text-gray-100 items-center px-4">
      <div className="border border-gray-700 rounded-lg p-8 w-full max-w-md shadow-white/5 shadow-md bg-gray-900 ">
        <h1 className="text-2xl font-semibold text-center mb-8">Register</h1>
        <div className="flex flex-col gap-4">
          <TextControl
            label="Username"
            type="text"
            value={userInfo.userName}
            setValue={(value) => setUserInfo({ ...userInfo, userName: value })}
            error={error.userName}
          />
          <TextControl
            label="Email"
            type="email"
            value={userInfo.email}
            setValue={(value) => setUserInfo({ ...userInfo, email: value })}
            error={error.email}
          />
          <TextControl
            label="Password"
            type="password"
            value={userInfo.password}
            setValue={(value) => setUserInfo({ ...userInfo, password: value })}
            error={error.password}
          />
          <TextControl
            label="Confirm Password"
            type="password"
            value={userInfo.confirmPassword}
            setValue={(value) =>
              setUserInfo({ ...userInfo, confirmPassword: value })
            }
            error={error.confirmPassword}
          />
        </div>
        <button
          onClick={registerUser}
          className="mt-8 cursor-pointer bg-purple-700 hover:bg-purple-800 duration-200 transition-colors px-8 py-2 text-lg rounded-2xl"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default page;
