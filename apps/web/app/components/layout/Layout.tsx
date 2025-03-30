import { Outlet } from "react-router";
import { Footer } from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col bg-gradient-dark">
      <main className="flex items-center justify-center min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
