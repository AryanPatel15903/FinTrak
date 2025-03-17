import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const user = localStorage.getItem("token");

  if (!user) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 bg-white shadow-sm rounded-lg m-4 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}