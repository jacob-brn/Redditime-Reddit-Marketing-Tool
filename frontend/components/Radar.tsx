"use client";
import React, { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const Radar = ({ className }: { className?: string }) => {
  const circles = new Array(5).fill(1);

  const maxRadius = useMemo(
    () => (circles.length * 6 * 16) / 2,
    [circles.length]
  );

  const dots = useMemo(
    () => [
      // Outer ring (near edge)
      { id: "dot-1", x: maxRadius * 0.85, y: 0, size: "8px", delay: 0.5 },
      {
        id: "dot-2",
        x: parseFloat((maxRadius * 0.8 * Math.cos(Math.PI / 4)).toFixed(3)),
        y: parseFloat((maxRadius * 0.8 * Math.cos(Math.PI / 4)).toFixed(3)),
        size: "7px",
        delay: 1.2,
      },
      { id: "dot-3", x: 0, y: maxRadius * 0.9, size: "9px", delay: 0.8 },
      {
        id: "dot-4",
        x: -parseFloat((maxRadius * 0.8 * Math.cos(Math.PI / 6)).toFixed(3)),
        y: parseFloat((maxRadius * 0.8 * Math.cos(Math.PI / 6)).toFixed(3)),
        size: "6px",
        delay: 1.7,
      },
      {
        id: "dot-5",
        x: -maxRadius * 0.75,
        y: -maxRadius * 0.1,
        size: "8px",
        delay: 0.3,
      },
      {
        id: "dot-6",
        x: parseFloat((maxRadius * 0.82 * Math.cos(Math.PI / 3)).toFixed(3)),
        y: -parseFloat((maxRadius * 0.82 * Math.cos(Math.PI / 3)).toFixed(3)),
        size: "7px",
        delay: 2.2,
      },
      {
        id: "dot-7",
        x: -maxRadius * 0.88,
        y: -maxRadius * 0.4,
        size: "9px",
        delay: 0.6,
      },
      {
        id: "dot-8",
        x: -parseFloat((maxRadius * 0.78 * Math.cos(Math.PI / 4)).toFixed(3)),
        y: parseFloat((maxRadius * 0.78 * Math.cos(Math.PI / 4)).toFixed(3)),
        size: "6px",
        delay: 1.9,
      },

      // Middle ring
      {
        id: "dot-9",
        x: maxRadius * 0.5,
        y: maxRadius * 0.5,
        size: "10px",
        delay: 2.1,
      },
      {
        id: "dot-10",
        x: -maxRadius * 0.6,
        y: maxRadius * 0.4,
        size: "7px",
        delay: 1.5,
      },
      {
        id: "dot-11",
        x: -maxRadius * 0.5,
        y: -maxRadius * 0.55,
        size: "8px",
        delay: 0.9,
      },
      {
        id: "dot-12",
        x: maxRadius * 0.45,
        y: -maxRadius * 0.6,
        size: "6px",
        delay: 2.5,
      },
      {
        id: "dot-13",
        x: maxRadius * 0.55,
        y: maxRadius * 0.2,
        size: "8px",
        delay: 1.8,
      },
      {
        id: "dot-14",
        x: maxRadius * 0.4,
        y: -maxRadius * 0.3,
        size: "7px",
        delay: 0.7,
      },
      {
        id: "dot-15",
        x: -maxRadius * 0.55,
        y: -maxRadius * 0.2,
        size: "9px",
        delay: 2.3,
      },
      {
        id: "dot-16",
        x: -maxRadius * 0.4,
        y: maxRadius * 0.6,
        size: "6px",
        delay: 1.1,
      },

      // Inner ring
      {
        id: "dot-17",
        x: maxRadius * 0.25,
        y: -maxRadius * 0.2,
        size: "9px",
        delay: 1.3,
      },
      {
        id: "dot-18",
        x: -maxRadius * 0.3,
        y: maxRadius * 0.15,
        size: "7px",
        delay: 2.8,
      },
      {
        id: "dot-19",
        x: maxRadius * 0.15,
        y: maxRadius * 0.25,
        size: "8px",
        delay: 0.7,
      },
      {
        id: "dot-20",
        x: -maxRadius * 0.2,
        y: -maxRadius * 0.25,
        size: "6px",
        delay: 2.0,
      },
      {
        id: "dot-21",
        x: maxRadius * 0.28,
        y: maxRadius * 0.1,
        size: "5px",
        delay: 1.4,
      },

      // Additional dots for better coverage
      {
        id: "dot-22",
        x: -parseFloat((maxRadius * 0.7 * Math.cos(Math.PI / 3)).toFixed(3)),
        y: -parseFloat((maxRadius * 0.7 * Math.cos(Math.PI / 3)).toFixed(3)),
        size: "6px",
        delay: 2.3,
      },
      {
        id: "dot-23",
        x: parseFloat((maxRadius * 0.65 * Math.cos(Math.PI / 5)).toFixed(3)),
        y: -parseFloat((maxRadius * 0.65 * Math.cos(Math.PI / 5)).toFixed(3)),
        size: "7px",
        delay: 1.1,
      },
      {
        id: "dot-24",
        x: -maxRadius * 0.2,
        y: -maxRadius * 0.3,
        size: "5px",
        delay: 1.9,
      },
      {
        id: "dot-25",
        x: parseFloat((maxRadius * 0.72 * Math.cos(Math.PI / 2)).toFixed(3)),
        y: parseFloat((maxRadius * 0.72 * Math.cos(Math.PI / 2)).toFixed(3)),
        size: "8px",
        delay: 0.4,
      },
    ],
    [maxRadius]
  );

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full scale-90 sm:scale-100",
        className
      )}
    >
      <div
        style={{
          transformOrigin: "right center",
        }}
        className="absolute right-1/2 top-1/2 z-40 flex h-[5px]
        overflow-hidden animate-radar-spin w-64 items-end justify-center bg-transparent"
      >
        <div className="relative z-40 h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      {/* Radar circles */}
      {circles.map((_circle, idx) => (
        <Circle
          style={{
            height: `${(idx + 1) * 6}rem`,
            width: `${(idx + 1) * 6}rem`,
            border: `1px solid var(--border)`,
            background: `rgba(255, 105, 0, ${
              idx * -0.2 + circles.length * 0.18
            })`,
          }}
          key={`motion-${idx}`}
          idx={idx}
        />
      ))}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-primary z-50"
          style={{
            width: dot.size,
            height: dot.size,
            left: "50%",
            top: "50%",
            transform: `translate(${dot.x}px, ${dot.y}px)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: dot.delay,
            repeatType: "loop",
            times: [0, 0.5, 1],
          }}
        />
      ))}
    </div>
  );
};

export const Circle = ({ className, idx, ...rest }: any) => {
  return (
    <motion.div
      {...rest}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: idx * 0.1,
        duration: 0.2,
      }}
      className={cn(
        "absolute inset-0 left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full",
        className
      )}
    ></motion.div>
  );
};
