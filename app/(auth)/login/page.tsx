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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex justify-center items-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to continue to EventHive</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col gap-5">
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

          <button
            onClick={loginUser}
            disabled={loading}
            className="mt-6 w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 px-8 py-3 text-lg font-semibold rounded-xl text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;