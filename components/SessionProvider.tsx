"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/authSlice";
import { toast } from "react-toastify";

export default function SessionProvider() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();

        if (data.success) {
          dispatch(setUser(data.user));
        } else if (res.status === 401) {
          console.log("Refreshing token...");
          await fetch("/api/user/refresh-token", { method: "POST" });

          // retry once after refreshing token
          const retry = await fetch("/api/user/me");
          const newData = await retry.json();
          if (newData.success) dispatch(setUser(newData.user));
        }
      } catch {
        toast.error("Failed to restore user session");
      }
    };

    restoreUser();
  }, [dispatch]);

  return null;
}
