import type { ReactNode } from "react";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}