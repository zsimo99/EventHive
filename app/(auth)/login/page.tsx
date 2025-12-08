"use client";
import TextControl from "@/components/TextControl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/authSlice";

function page() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<any>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  const loginUser = async () => {
    if(loading) return;
    setLoading(true);
    try {
      if(!userInfo.email || !userInfo.password){
        toast.error("Please fill in all required fields");
        setError({
          ...error,
          email: !userInfo.email ? "email is required" : "",
          password: !userInfo.password ? "password is required" : "",
        });
        return;
      }
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfo.email,
          password: userInfo.password,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Login successful!");
        dispatch(setUser(data.data));
        router.push("/");
      } else {
        const data = await res.json();
        if(data.message=="Invalid password") setError((prevError:any)=>({...prevError, password:"Invalid password"}));
        toast.error(data.message.split(",")[0] || "Login failed. Please try again.");
        if (data.errors) {
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
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-30  bg-linear-to-b from-indigo-700 to-fuchsia-600 flex justify-center text-gray-900 items-center px-4">
      <div className="border border-gray-200 rounded-lg p-8 w-full max-w-md shadow-sm bg-gray-200">
        <h1 className="text-2xl font-semibold text-center mb-8">Login</h1>
        <div className="flex flex-col gap-4">
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
        </div>
        <p className="text-gray-500 my-4">
          dont have an account?{" "}
          <Link href="/register" className="text-purple-700 hover:underline">
            Register
          </Link>
        </p>
        <button
          onClick={loginUser}
          className="mt-8 cursor-pointer bg-purple-700 hover:bg-purple-800 duration-200 transition-colors px-8 py-2 text-lg rounded-2xl text-white w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  )
}

export default page