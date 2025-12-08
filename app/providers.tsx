"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useEffect } from "react";
import { setUser } from "@/lib/authSlice";
import { toast } from "react-toastify";

export default function Providers({ children }: { children: React.ReactNode }) {

  return <Provider store={store}>{children}</Provider>;
}
