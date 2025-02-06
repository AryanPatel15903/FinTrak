import React from 'react';
import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut } from 'lucide-react';
import { useState,useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
  //   const { user, signOut } = useAuth();
  
  //   const handleSignOut = async () => {
    //     try {
      //       await signOut();
      //     } catch (error) {
        //       console.error('Error signing out:', error);
        //     }
        //   };
        
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

const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
};

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinTrak</span>
            </Link>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{userData.firstName}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          ):(
            <li>
              <Link to="/login" className="nav-links">
                <i className="fa-solid fa-sign-in-alt"></i> Login
              </Link>
            </li>
          )}
        </div>
      </div>
    </nav>
  );
}
