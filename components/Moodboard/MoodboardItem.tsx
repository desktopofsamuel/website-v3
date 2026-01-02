"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface MoodboardItemProps {
  id: string;
  src: string;
  title: string;
  initialX: number;
  initialY: number;
  initialRotation: number;
  width?: number;
  height?: number;
}

export const MoodboardItem = ({
  id,
  src,
  title,
  initialX,
  initialY,
  initialRotation,
  width = 300,
  height = 400,
}: MoodboardItemProps) => {
  const [zIndex, setZIndex] = useState(1);

  return (
    <motion.div
      drag
      dragMomentum={true}
      initial={{
        x: initialX,
        y: initialY,
        rotate: initialRotation,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      }}
      whileHover={{ scale: 1.02, cursor: "grab" }}
      whileDrag={{ scale: 1.1, cursor: "grabbing", zIndex: 100 }}
      onDragStart={() => setZIndex(100)}
      onDragEnd={() => setZIndex(1)}
      style={{
        position: "absolute",
        zIndex: zIndex,
        width,
        height,
      }}
      className="bg-white shadow-2xl p-2 rounded-sm"
    >
      <div className="relative w-full h-full overflow-hidden bg-gray-100 pointer-events-none">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover pointer-events-none select-none"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          draggable={false}
        />
      </div>
    </motion.div>
  );
};
