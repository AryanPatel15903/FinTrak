import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    // window.location.reload();
    navigate('/home');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-blue-600 transform hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                FinTrak
              </span>
            </Link>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {userData.firstName[0].toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">
                  {userData.firstName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-md flex items-center space-x-2 border border-transparent hover:border-red-100 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/home" 
              className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}