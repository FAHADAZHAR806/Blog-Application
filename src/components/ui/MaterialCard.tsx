import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /**
   * Wix Strategy: We use 'elevation' not just for shadows,
   * but to define the visual 'z-index' of the content.
   */
  elevation?: 0 | 1 | 2;
}

/**
 * A sophisticated container based on the Wix 'Tactile' design language.
 * Uses soft ambient shadows and large corner radii for a premium feel.
 */
export default function MaterialCard({
  children,
  className = "",
  elevation = 1,
}: Props) {
  // Mapping Wix-style elevations to subtle shadow and border configurations
  const elevationStyles = {
    0: "shadow-none border-zinc-100", // Flat, integrated look
    1: "shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-zinc-50", // Standard ambient lift
    2: "shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-transparent", // High-impact focus
  };

  return (
    <div
      className={`
        /* Base Styling: Pure and Breathable */
        bg-white 
        rounded-[2rem] 
        p-6 
        border
        transition-all 
        duration-500 
        ease-in-out
        
        /* Performance Optimization: Avoid complex filter-based shadows */
        ${elevationStyles[elevation]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
