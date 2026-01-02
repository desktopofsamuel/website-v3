"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
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

// Define the boundaries of our infinite canvas
const CANVAS_SIZE = 4000;
const BOUNDARY_PADDING = 500; // Extra padding before hitting the wall

export const MoodboardCanvas = () => {
  const { data, error } = useSWR<MoodboardData[]>("/moodboard-data.json", fetcher);
  const [items, setItems] = useState<MoodboardData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for the canvas position
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Create smooth springs for the camera movement
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    if (data) {
      const randomizedItems = data.map((item, index) => {
         // Distribute within a safe area
         const spreadX = CANVAS_SIZE - 1000;
         const spreadY = CANVAS_SIZE - 1000;
         
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

  const snapToItem = (itemX: number, itemY: number) => {
    x.set(-itemX);
    y.set(-itemY);
  };

  if (error) return <div className="flex items-center justify-center h-screen">Failed to load moodboard data</div>;
  if (!data) return <div className="flex items-center justify-center h-screen">Loading moodboard...</div>;

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-[#e5e5e5] cursor-grab active:cursor-grabbing"
        style={{
            backgroundImage: "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            backgroundPosition: "center center"
        }}
    >
      <motion.div
        drag
        dragMomentum={false}
        style={{ x: springX, y: springY }}
        onDrag={(event, info) => {
            x.set(x.get() + info.delta.x);
            y.set(y.get() + info.delta.y);
        }}
        className="absolute left-1/2 top-1/2 w-0 h-0" // Origin at center of screen
      >
        {/* Boundary Border Visualization (Optional - helps to see the limit) */}
        <div 
            className="absolute border-2 border-dashed border-gray-400 pointer-events-none opacity-30"
            style={{
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                left: -CANVAS_SIZE/2,
                top: -CANVAS_SIZE/2,
            }}
        />

        {items.map((item) => (
          <MoodboardItem
            key={item.id}
            {...item}
            initialX={item.initialX!}
            initialY={item.initialY!}
            initialRotation={item.rotation!}
            onSnapToCenter={() => snapToItem(item.initialX!, item.initialY!)}
            dragConstraints={{
                left: -CANVAS_SIZE/2 + (item.width || 300)/2,
                right: CANVAS_SIZE/2 - (item.width || 300)/2,
                top: -CANVAS_SIZE/2 + (item.height || 400)/2,
                bottom: CANVAS_SIZE/2 - (item.height || 400)/2,
            }}
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
