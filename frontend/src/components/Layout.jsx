import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}