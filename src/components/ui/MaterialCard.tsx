import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  elevation?: 1 | 2;
}

export default function MaterialCard({
  children,
  className = "",
  elevation = 1,
}: Props) {
  return (
    <div
      className={`
      bg-surface-container 
      rounded-md-3 
      p-6 
      transition-shadow 
      duration-200
      ${elevation === 1 ? "shadow-m3-1" : "shadow-m3-2"}
      ${className}
    `}
    >
      {children}
    </div>
  );
}
