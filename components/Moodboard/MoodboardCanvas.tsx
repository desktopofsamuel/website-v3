"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import Link from "next/link";
import { MoodboardItem } from "./MoodboardItem";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MoodboardData {
  id: string;
  src: string;
  title: string;
  width?: number;
  height?: number;
  initialX?: number;
  initialY?: number;
  rotation?: number;
}

export const MoodboardCanvas = () => {
  const { data, error } = useSWR<MoodboardData[]>("/moodboard-data.json", fetcher);
  const [items, setItems] = useState<MoodboardData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      // Randomize positions if not provided
      // Distribute them somewhat grid-like but with randomness?
      // Or pure random? Prompt says "randomly rotated and placed".
      // Let's do a spread out random placement.
      
      const randomizedItems = data.map((item, index) => {
         // Create a rough grid or spiral to avoid complete overlap stacking if random range is small?
         // Let's just use a large area.
         const spreadX = 2000;
         const spreadY = 1500;
         
         return {
            ...item,
            initialX: item.initialX ?? (Math.random() * spreadX - spreadX/2),
            initialY: item.initialY ?? (Math.random() * spreadY - spreadY/2),
            rotation: item.rotation ?? (Math.random() * 30 - 15),
         };
      });
      setItems(randomizedItems);
    }
  }, [data]);

  if (error) return <div className="flex items-center justify-center h-screen">Failed to load moodboard data</div>;
  if (!data) return <div className="flex items-center justify-center h-screen">Loading moodboard...</div>;

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-[#e5e5e5] cursor-grab active:cursor-grabbing"
    >
      {/* 
        The "Canvas" itself. 
        We center it initially.
        Using a very large drag constraint area to simulate "infinite".
      */}
      <motion.div
        drag
        dragMomentum={false} // Canvas panning usually feels better without momentum or with very low momentum
        className="absolute left-1/2 top-1/2 w-0 h-0" // Origin at center of screen
      >
        {items.map((item) => (
          <MoodboardItem
            key={item.id}
            {...item}
            initialX={item.initialX!}
            initialY={item.initialY!}
            initialRotation={item.rotation!}
          />
        ))}
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-50">
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full text-sm font-medium text-gray-800 shadow-lg border border-white/20 pointer-events-auto flex gap-4 items-center">
            <Link href="/" className="hover:text-black transition-colors text-gray-500">
                Home
            </Link>
            <div className="w-px h-4 bg-gray-300" />
            <span>Infinite Canvas Moodboard</span>
            <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-white px-3 py-1 rounded-full text-xs hover:bg-gray-800 transition-colors"
            >
                Reset
            </button>
        </div>
      </div>
    </div>
  );
};
