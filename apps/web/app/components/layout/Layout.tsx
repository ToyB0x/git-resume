import type { ReactNode } from "react";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col bg-gradient-dark">
      <main className="flex items-center justify-center min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}
