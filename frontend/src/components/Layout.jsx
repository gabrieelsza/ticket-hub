import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f3efe6]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}