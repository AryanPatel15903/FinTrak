import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
//   const { user, loading } = useAuth();
const user = localStorage.getItem("token");

//   if (loading) {
//     return <div>Loading...</div>;
//   }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}