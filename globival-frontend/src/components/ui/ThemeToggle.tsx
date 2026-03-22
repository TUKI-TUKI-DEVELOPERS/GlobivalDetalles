"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-muted transition-colors hover:bg-muted/80"
      aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform ${
          theme === "dark" ? "translate-x-7" : "translate-x-1"
        }`}
      >
        {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}
