"use client";

import React from "react";
import { toast } from "react-toastify";

interface ShareEventButtonProps {
  title: string;
}

export default function ShareEventButton({ title }: ShareEventButtonProps) {
  const handleShare = async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out this event on EventHive: ${title}`,
          url,
        });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Event link copied to clipboard");
        return;
      }

      // Fallback
      window.prompt("Copy this event link:", url);
    } catch (error) {
      console.error(error);
      toast.error("Unable to share this event");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="cursor-pointer px-6 py-2.5 rounded-xl border border-gray-300 text-gray-800 text-sm hover:bg-gray-50 transition"
    >
      Share event
    </button>
  );
}
