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
  onSnapToCenter?: () => void;
  dragConstraints?: React.RefObject<Element> | { top?: number; right?: number; bottom?: number; left?: number };
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
  onSnapToCenter,
  dragConstraints,
}: MoodboardItemProps) => {
  const [zIndex, setZIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={true}
      dragConstraints={dragConstraints}
      dragElastic={0.1} // Adds a little resistance when hitting the edge
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
      onDragStart={() => {
        setZIndex(100);
        setIsDragging(true);
      }}
      onDragEnd={() => {
        setZIndex(1);
        setTimeout(() => setIsDragging(false), 100); // Small delay to prevent click trigger
      }}
      onClick={() => {
        if (!isDragging && onSnapToCenter) {
          onSnapToCenter();
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        position: "absolute",
        zIndex: zIndex,
        width,
        height,
      }}
      className="bg-white shadow-2xl p-2 rounded-sm group"
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
      
      {/* Title Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50"
      >
        {title}
      </motion.div>
    </motion.div>
  );
};
