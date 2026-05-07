import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  elevation?: 0 | 1 | 2;
}

export default function MaterialCard({
  children,
  className = "",
  elevation = 1,
}: Props) {
  const elevationStyles = {
    0: "shadow-none border-zinc-100",
    1: "shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-zinc-50",
    2: "shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-transparent",
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
