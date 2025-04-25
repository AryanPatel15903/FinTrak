import React from 'react';
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Signup from "./components/Singup";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/pages/Employee/Dashboard";
import ExpenseForm from "./components/pages/Employee/ExpenseForm";
import MyExpenses from "./components/pages/Employee/MyExpenses";
import Recommendation from "./components/pages/Employee/Recommendation";
import AdminDashboard from "./components/pages/Admin/AdminDashboard";
import ManagerDashboard from "./components/pages/Manager/ManagerDashboard";
import EmployeeExpenses from "./components/pages/Manager/EmployeeExpenses";
import Homepage from "./components/Homepage"; // Import the new Homepage component
import FeaturesPage from "./components/FeaturesPage";
import PricingPage from './components/PricingPage';
import AboutPage from './components/AboutPage';
import Mistral from './components/pages/Mistral_Testing';

import AssignBudget from './components/pages/Admin/AssignBudget';
import AssignManager from './components/pages/Admin/AssignManager';
import PolicyManagement from './components/pages/Admin/PolicyManagement';

// Protected Route Component
const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || !userRole) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

function App() {
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
            <Route path="/home" element={<Homepage />} /> {/* Add the homepage route */}
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/mistral" element={<Mistral />} />
            
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Wrap protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={getDashboardByRole()} />
                    <Route path="expenses/new" element={<ExpenseForm />} /> {/* Changed to relative path */}
                    <Route path="expenses" element={<MyExpenses />} /> {/* Changed to relative path */}
                    <Route path="recommendation" element={<Recommendation />} /> {/* Changed to relative path */}
                    
                    {userRole === 'admin' && (
                        <>
                            <Route path="admin" element={<AdminDashboard />} />
                            <Route path="/admin/assign-manager" element={<AssignManager />} />
                            <Route path="/admin/assign-budget" element={<AssignBudget />} />
                            <Route path="/admin/policy-management" element={<PolicyManagement />} />
                        </>
                    )}
                    
                    {userRole === 'manager' && (
                        <>
                            <Route path="manager" element={<ManagerDashboard />} /> {/* Changed to relative path */}
                            <Route path="manager/employee/:employeeId/expenses" element={<EmployeeExpenses />} /> {/* Changed to relative path */}
                        </>
                    )}
                </Route>
            </Route>
        </Routes>
    );
}

export default App;