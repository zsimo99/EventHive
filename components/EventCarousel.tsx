"use client";

import React, { useEffect, useRef, useState } from "react";
import EventCard from "./EventCard";

type EventType = any;

export default function EventCarousel({ events }: { events: EventType[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 768) setSlidesPerView(1);
      else if (w < 1024) setSlidesPerView(2);
      else setSlidesPerView(3);
      // measure container width for pixel-perfect translate
      requestAnimationFrame(() => {
        if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
      });
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, events.length - slidesPerView);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, 4000);
    return () => clearInterval(id);
  }, [maxIndex, paused]);

  useEffect(() => {
    // clamp current when slidesPerView changes
    if (current > maxIndex) setCurrent(maxIndex);
  }, [slidesPerView, maxIndex]);

  const goPrev = () => setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  const goNext = () => setCurrent((c) => (c >= maxIndex ? 0 : c + 1));

  // Touch / Drag handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (touchDeltaX.current > 50) goPrev();
    else if (touchDeltaX.current < -50) goNext();
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setPaused(false);
  };

  // Pointer (mouse drag) support
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    touchStartX.current = e.clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.clientX - touchStartX.current;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (touchStartX.current == null) return;
    if (touchDeltaX.current > 60) goPrev();
    else if (touchDeltaX.current < -60) goNext();
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setPaused(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const percent = (current * 100) / slidesPerView;

  // center index within the visible window (used to highlight middle slide)
  const centerOffset = Math.floor(slidesPerView / 2);

  const slideWidth = containerWidth ? containerWidth / slidesPerView : 0;
  const translateX = -current * slideWidth;

  return (
    <div className="relative  px-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="overflow-hidden"
      >
        <div
          className="flex gap-4 transition-transform duration-500 items-stretch"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {events.map((e: any, i: number) => {
            const isVisible = i >= current && i < current + slidesPerView;
            const centerIndex = current + centerOffset;
            const isCenter = i === centerIndex && isVisible;
            // for slidesPerView === 2, highlight both visible slides slightly
            const isHighlighted = slidesPerView === 2 ? isVisible : isCenter;
            return (
              <div
                key={e._id}
                style={{ width: slideWidth ? `${slideWidth}px` : `${100 / slidesPerView}%` }}
                className={`flex-shrink-0 transition-transform duration-500 ${
                  isHighlighted ? "scale-105 z-20" : "scale-95 z-10 opacity-95"
                }`}
              >
                <div className="px-2">
                  <EventCard {...e} bookedSeats={e.bookedSeats ?? 0} booked={e.booked ?? 0} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev/Next buttons */}
      <button
        aria-label="Previous"
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md p-2 rounded-full"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md p-2 rounded-full"
      >
        ›
      </button>

      {/* Dots */}
      <div className="flex gap-2 justify-center mt-4">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full ${i === current ? "bg-indigo-700" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
