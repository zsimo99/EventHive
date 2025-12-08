"use client";
import TextControl from "@/components/TextControl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const registerUser = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setError({ userName: "", email: "", password: "", confirmPassword: "" });
      if (!userInfo.userName || !userInfo.email || !userInfo.password) {
        toast.error("Please fill in all required fields");
        setError({
          ...error,
          userName: !userInfo.userName ? "username is required" : "",
          email: !userInfo.email ? "email is required" : "",
          password: !userInfo.password ? "password is required" : "",
        });
        return;
      }

      if (userInfo.password !== userInfo.confirmPassword) {
        toast.error("Passwords do not match");
        setError((prev: any) => ({
          ...prev,
          confirmPassword: "passwords do not match",
        }));
        return;
      }
      const formdata = new FormData();
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
        router.push("/login");
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
        if (data.message === "email already exists") {
          setError((prevError: any) => ({
            ...prevError,
            email: "Email already exists",
          }));
        }
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen py-30  bg-linear-to-b from-indigo-700 to-fuchsia-600 flex justify-center text-gray-900 items-center px-4">
      <div className="border border-gray-200 rounded-lg p-8 w-full max-w-md shadow-sm bg-gray-200">
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
        <p className="text-gray-500 my-4">
          already have an account?{" "}
          <Link href="/login" className="text-purple-700 hover:underline">
            Login
          </Link>
        </p>

        <button
          onClick={registerUser}
          className="mt-8 cursor-pointer bg-purple-700 hover:bg-purple-800 duration-200 transition-colors px-8 py-2 text-lg rounded-2xl text-white w-full"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default page;
