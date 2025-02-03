import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
//   const { user } = useAuth();
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userData, setUserData] = useState(null);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const { data } = await axios.get("http://localhost:8080/api/users/me", {
        headers: { "x-auth-token": token },
      });

      setUserData(data);
      setIsLoggedIn(true);

      
    } catch (err) {
      console.error("Failed to fetch user data", err);
      setIsLoggedIn(false);
    }
  };

  fetchUserData();
}, []);

  return (
    <>
    {isLoggedIn ? (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {userData.firstName}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Pending Expenses</h2>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Approved Expenses</h2>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Rejected Expenses</h2>
          <p className="text-3xl font-bold text-red-600">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          <div className="text-gray-500 text-center py-8">
            No expenses found. Create your first expense claim!
          </div>
        </div>
      </div>
    </div>) : (<li>
                  <Link to="/login" className="nav-links">
                    <i className="fa-solid fa-sign-in-alt"></i> Login
                  </Link>
                </li>)}
    
    </>
  );
}