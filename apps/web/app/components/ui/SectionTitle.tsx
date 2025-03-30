import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h3 className={`text-xl font-semibold mb-4 text-gradient ${className}`}>
      {children}
    </h3>
  );
}