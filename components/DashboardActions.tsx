"use client";

import React, { useState } from "react";
import CreateEventModal from "@/components/CreateEventModal";

export default function DashboardActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800"
      >
        + New event
      </button>

      <CreateEventModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          // Optionally trigger a refresh with router.refresh() in a parent if needed
        }}
      />
    </>
  );
}
