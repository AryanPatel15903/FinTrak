import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SidebarAdmin from "./Sidebars/SidebarAdmin";
import SidebarManager from "./Sidebars/SidebarManager";
import SidebarEmployee from "./Sidebars/SidebarEmployee";

export default function Layout() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/home" />;
  }

  const getSidebarByRole = () => {
    switch (userRole) {
      case "admin":
        return <SidebarAdmin />;
      case "manager":
        return <SidebarManager />;
      case "employee":
        return <SidebarEmployee />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <div className="flex">
        {getSidebarByRole()}
        <main className="flex-1 p-8 bg-white shadow-sm rounded-lg m-4 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
