import React from 'react';
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Signup from "./components/Singup";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/pages/Dashboard";
import ExpenseForm from "./components/pages/ExpenseForm";
import MyExpenses from "./components/pages/MyExpenses";
import AdminDashboard from "./components/pages/AdminDashboard";
import ManagerDashboard from "./components/pages/ManagerDashboard";
import EmployeeExpenses from "./components/pages/EmployeeExpenses";

// Protected Route Component
const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || !userRole) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

function App() {
    // const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    const getDashboardByRole = () => {
        switch(userRole) {
            case 'admin':
                return <AdminDashboard />;
            case 'manager':
                return <ManagerDashboard />;
            case 'employee':
                return <Dashboard />;
            default:
                return <Navigate replace to="/login" />;
        }
    };

    return (
        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Wrap protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={getDashboardByRole()} />
                    <Route path="/expenses/new" element={<ExpenseForm />} />
                    <Route path="/expenses" element={<MyExpenses />} />
                    
                    {userRole === 'admin' && (
                        <Route path="/admin" element={<AdminDashboard />} />
                    )}
                    
                    {userRole === 'manager' && (
                        <>
                            <Route path="/manager" element={<ManagerDashboard />} />
                            <Route path="/manager/employee/:employeeId/expenses" element={<EmployeeExpenses />} />
                        </>
                    )}
                </Route>
            </Route>
        </Routes>
    );
}

export default App;