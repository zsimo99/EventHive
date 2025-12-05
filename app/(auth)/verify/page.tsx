"use client";
import React, { use, useEffect } from "react";

function page() {
  const [loading, setLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const verifyUser = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");
      if (!token) {
        throw new Error("No token provided");
      }
      const res = await fetch(`/api/user/verify?token=${token}`, {
        method: "GET",
        // body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        throw new Error("Verification failed");
      }
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setSuccess(false);
    }
  };
  useEffect(() => {
    verifyUser();
  }, []);
  if (loading) {
    return (
      <div className="h-screen pt-20 bg-linear-to-br from-gray-950 to-gray-800 flex justify-center text-gray-100 items-center px-4">
        <h1 className="text-2xl font-semibold">Verifying...</h1>
      </div>
    );
  }
  return (
    <div className="h-screen pt-20 bg-linear-to-br from-gray-950 to-gray-800 flex justify-center text-gray-100 items-center px-4">
      <div className="border border-gray-700 rounded-lg p-8 w-full max-w-md shadow-white/5 shadow-md bg-gray-900">
        {success ? (
          <h1 className="text-2xl font-semibold text-center   text-green-500">
            ✅ Your account has been verified successfully!
          </h1>
        ) : (
          <>
          <h1 className="text-2xl font-semibold text-center   text-red-500">
            ❌ Verification failed. Please try again.
          </h1>
          <p className="mt-4">Your verification token might be invalid or expired.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default page;
