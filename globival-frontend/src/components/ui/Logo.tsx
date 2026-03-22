"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { width: 100, height: 40 },
  md: { width: 140, height: 56 },
  lg: { width: 180, height: 72 },
};

export default function Logo({ size = "md", className }: LogoProps) {
  const dimensions = sizeMap[size];

  return (
    <Image
      src="/logo_globival.png"
      alt="Globival Detalles"
      width={dimensions.width}
      height={dimensions.height}
      style={{ width: "auto", height: "auto", maxWidth: dimensions.width, maxHeight: dimensions.height }}
      className={cn("object-contain transition-all dark:brightness-0 dark:invert", className)}
      priority
    />
  );
}
