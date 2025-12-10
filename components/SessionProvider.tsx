"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/authSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";

export default function SessionProvider() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();

        if (data.success) {
          dispatch(setUser(data.data));
        } else if (res.status === 401) {
          console.log("Refreshing token...");
          await fetch("/api/user/refresh-token", { method: "POST" });

          // retry once after refreshing token
          const retry = await fetch("/api/user/me");
          const newData = await retry.json();
          
          if (newData.success) dispatch(setUser(newData.data));
          else throw new Error("Failed to restore session after token refresh");
        }
      } catch {
        toast.error("Failed to restore user session");
        await fetch("/api/user/logout", { method: "POST" });
      }finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, [dispatch]);

  if (loading) return <Loader />;
}
