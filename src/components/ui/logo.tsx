
"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "color";
}

export function Logo({ className, variant = "color" }: LogoProps) {
  const colorClass = variant === "light" ? "text-white" : variant === "dark" ? "text-black" : "text-primary";
  
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Calendar Body */}
        <rect x="15" y="25" width="70" height="60" rx="8" fill="currentColor" className={colorClass} />
        
        {/* Top Header Section */}
        <path d="M15 33C15 28.5817 18.5817 25 23 25H77C81.4183 25 85 28.5817 85 33V42H15V33Z" fill="black" fillOpacity="0.2" />
        
        {/* Calendar Rings */}
        <rect x="28" y="20" width="6" height="12" rx="3" fill="white" />
        <rect x="66" y="20" width="6" height="12" rx="3" fill="white" />
        
        {/* Audio Waveform Lines (simplified for SVG) */}
        <g stroke="white" strokeWidth="0.5" strokeLinecap="round">
          <line x1="25" y1="33" x2="25" y2="34" />
          <line x1="28" y1="32" x2="28" y2="35" />
          <line x1="31" y1="30" x2="31" y2="37" />
          <line x1="34" y1="33" x2="34" y2="34" />
          <line x1="37" y1="31" x2="37" y2="36" />
          <line x1="40" y1="29" x2="40" y2="38" />
          <line x1="43" y1="32" x2="43" y2="35" />
          <line x1="46" y1="30" x2="46" y2="37" />
          <line x1="49" y1="33" x2="49" y2="34" />
          <line x1="52" y1="31" x2="52" y2="36" />
          <line x1="55" y1="28" x2="55" y2="39" />
          <line x1="58" y1="32" x2="58" y2="35" />
          <line x1="61" y1="30" x2="61" y2="37" />
          <line x1="64" y1="33" x2="64" y2="34" />
          <line x1="67" y1="31" x2="67" y2="36" />
          <line x1="70" y1="29" x2="70" y2="38" />
          <line x1="73" y1="32" x2="73" y2="35" />
          <line x1="76" y1="33" x2="76" y2="34" />
        </g>
        
        {/* PE Text */}
        <text
          x="50"
          y="70"
          textAnchor="middle"
          fill="white"
          fontFamily="Space Grotesk, sans-serif"
          fontSize="24"
          fontWeight="300"
          style={{ letterSpacing: "2px" }}
        >
          PE
        </text>
      </svg>
    </div>
  );
}
